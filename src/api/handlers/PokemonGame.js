import {CitraClient, InBattlePokemonData, PokemonTeamData} from '@/api/ram_editor'
import {CombatEnv, CombatType} from "@/api/ram_editor/RamAccesor";
import {decryptPokemonData as decryptData} from "@/api/lib/PokemonCrypt";
import {getSaveName, watchSave} from "@/api/save_editor";
import {logger, save_combat_log} from "@/api/handlers/logging";
import {validatePokemon} from "@/api/lib/validators";
import {RAM_ROM} from "@/stores/back_constants";

let SLOT_OFFSET = 484;
let SLOT_DATA_SIZE = 232;
let STAT_DATA_SIZE = 22;

const TeamOwner = Object.freeze({
    YOU: 'YOU',
    ENEMY: 'ENEMY',
    ALLY: 'ALLY'
});

class GameData {
    constructor(options) {
        this.is_communicating = false;
        this.combat_info = new CombatData(options.combat_info);
        this.your_data = new TeamData(options.your_data);
        this.enemy_data = new TeamData(options.enemy_data);
        this.ally_data = new TeamData(options.ally_data);
        this.comms_closed = true;
    }

    async startComms(rom, ipc, pokemon_game, save_file_path, win) {
        let citra = new CitraClient();
        try {
            this.comms_closed = false;
            let trainer_name;
            await citra.readMemory(0, 1).then(() => {
                trainer_name = getSaveName(save_file_path);
                ipc.reply('trainer_name', trainer_name);
                watchSave(win, save_file_path)
            });

            while (this.is_communicating) {
                await this.combat_info.startComms(rom, this, citra);
                await this.your_data.startComms(rom, this, this.combat_info.addresses.ally, this.combat_info.ally_selected, citra);
                await this.enemy_data.startComms(rom, this, this.combat_info.addresses.enemy, this.combat_info.enemy_selected, citra);
                await this.ally_data.startComms(rom, this, this.combat_info.addresses.ally, this.combat_info.ally_selected, citra);

                let your_team_length = this.your_data.team.filter((pokemon) => pokemon && validatePokemon(pokemon.dex_number)).length
                for (let slot = 0; slot < your_team_length; slot++) {
                    let pokemon = this.your_data.team[slot];
                    if (!pokemon) continue;
                    pokemon.discovered = true;
                    pokemon.battle_data = this.combat_info.your_battle_data[slot];
                }

                if (this.combat_info.enemy_battle_data.length > 0) {
                    this.enemy_data.team = this.combat_info.enemy_battle_data;
                }
                this.ally_data.team = this.combat_info.ally_npc_battle_data;

                if (pokemon_game.alreadySent !== JSON.stringify(this)) {
                    logger.info(this.enemy_data)
                    ipc.reply('updated_game_data', this);
                    pokemon_game.alreadySent = JSON.stringify(this);
                }
            }
        } catch (e) {
            console.log(e)
        } finally {
            this.is_communicating = false;
            this.comms_closed = true;
            console.log('e2')
            citra.socket.close()
        }
    }
}

class TeamData {
    constructor(options) {
        this.owner = options.owner;
        this.team = options.team;
        this.team_data = [];
        this.selected_pokemon = [];
        this.discovered_pokemons = options.discovered_pokemons;
        this.is_enemy = options.is_enemy;
    }

    async startComms(rom, game_data, addresses, selected_pokemon_dex, citra) {
        await this.loadPokemonData(rom, game_data, addresses, citra);
        this.selected_pokemon = [];
        if (!game_data.combat_info.in_combat) {
            return;
        }

        if (game_data.combat_info.next_pokemon && this.owner === TeamOwner.ENEMY) {
            const filtered = this.team_data.filter(pokemon => pokemon && pokemon.species.toLowerCase() === game_data.combat_info.next_pokemon);
            this.selected_pokemon.push(filtered[0].dex_number)
        } else {
            for (const dex_number of selected_pokemon_dex) {
                this.selected_pokemon.push(parseInt(dex_number || 0))
            }
        }
    }

    async loadPokemonData(rom, game_data, addresses, citra) {
        if (addresses.read_address === 0) {
            return;
        }

        for (let slot = 0; slot < 6; slot++) {
            let slot_address = addresses.read_address + (slot * SLOT_OFFSET)
            let pokemonData = await citra.readMemory(slot_address, SLOT_DATA_SIZE);
            let statsData = await citra.readMemory(slot_address + SLOT_DATA_SIZE + 112, STAT_DATA_SIZE);

            if (pokemonData && statsData) {
                let data = Buffer.concat([pokemonData, statsData]);
                let move_data;
                if (this.is_enemy) {
                    let allyParty = Object.entries(game_data.your_data.team).filter((v) => {
                        // eslint-disable-next-line no-unused-vars
                        let [index, pokemon] = v;
                        return pokemon && pokemon.dex_number !== 0;
                    });

                    move_data = await citra.readMemory(addresses.pp_address + rom.mongap * (slot + allyParty.length), 56)
                } else {
                    move_data = await citra.readMemory(addresses.pp_address + rom.mongap * slot, 56)
                }

                let pokemon = new PokemonTeamData(move_data, data);
                if (validatePokemon(pokemon.dex_number)) {
                    if (JSON.stringify(this.team[slot]) === JSON.stringify(pokemon)) return;
                    if (this.owner === TeamOwner.YOU) {
                        this.team[slot] = pokemon;
                    } else if (this.owner === TeamOwner.ENEMY) {
                        this.team_data[slot] = pokemon;
                    }
                } else {
                    if (this.owner === TeamOwner.YOU) {
                        this.team[slot] = null;
                    } else if (this.owner === TeamOwner.ENEMY) {
                        this.team_data[slot] = null;
                    }
                }
            }
        }
    }
}

class CombatData {
    constructor(options) {
        this.combat_type = options.combat_type;
        this.in_combat = options.in_combat;
        this.combat_env = options.combat_env;
        this.addresses = {};
        this.enemy_selected = [];
        this.ally_selected = [];

        this.your_battle_data = [];
        this.enemy_battle_data = [];
        this.ally_npc_battle_data = [];
        this.combat_log_messages = [];
        this.combat_move_log_messages = [];
        this.next_pokemon = null;
    }

    async getAddresses(rom, citra) {
        let read_address;
        let pp_address;
        let enemy_read_address;
        let enemy_pp_address;
        let current_opponent_address;
        let multi_combat_mongap;

        let wildData = await citra.readMemory(rom.battleWildPartyAddress, rom.slot_data_size);
        let rawWildData = decryptData(wildData);
        let wildPP = (await citra.readMemory(rom.wildppadd, 1)).readUInt8(0);
        let wildDex = rawWildData.subarray(8).readUInt16LE()

        let trainerData = await citra.readMemory(rom.battleTrainerPartyAddress, rom.slot_data_size);
        let rawTrainerData = decryptData(trainerData);
        let trainerPP = (await citra.readMemory(rom.trainerppadd, 1)).readUInt8(0);
        let trainerDex = rawTrainerData.subarray(8).readUInt16LE()

        if (validatePokemon(wildDex) && wildPP < 65) {
            read_address = rom.battleWildPartyAddress;
            pp_address = rom.wildppadd;
            enemy_read_address = rom.wildOpponentPartyAddress;
            enemy_pp_address = rom.wildppadd;
            current_opponent_address = rom.currentOpponentAddress;
            multi_combat_mongap = rom.multiCombatMonGap;

            this.combat_env = CombatEnv.WILD;
            this.in_combat = true;
        } else if (validatePokemon(trainerDex) && trainerPP < 65) {
            read_address = rom.battleTrainerPartyAddress;
            pp_address = rom.trainerppadd;
            enemy_read_address = rom.trainerOpponentPartyAddress;
            enemy_pp_address = rom.trainerppadd;
            current_opponent_address = rom.currentOpponentAddress;
            multi_combat_mongap = rom.multiCombatMonGap;

            this.combat_env = CombatEnv.TRAINER;
            this.in_combat = true;
        } else {
            read_address = rom.partyAddress;
            pp_address = rom.wildppadd;
            enemy_read_address = 0;
            enemy_pp_address = 0;
            current_opponent_address = 0;
            multi_combat_mongap = 0;

            this.combat_env = CombatEnv.OFF;
            this.in_combat = false;
        }

        return {
            ally: {
                read_address: read_address,
                pp_address: pp_address,
            },
            enemy: {
                read_address: enemy_read_address,
                pp_address: enemy_pp_address,
            },
            current_opponent_address,
            multi_combat_mongap
        }
    }

    async getCombatData(citra) {
        let first_pokemon_address = this.addresses.current_opponent_address - this.addresses.multi_combat_mongap;
        let second_pokemon_address = this.addresses.current_opponent_address;
        let third_pokemon_address = this.addresses.current_opponent_address + (this.addresses.multi_combat_mongap * 1);
        let fourth_pokemon_address = this.addresses.current_opponent_address + (this.addresses.multi_combat_mongap * 2);
        let fifth_pokemon_address = this.addresses.current_opponent_address + (this.addresses.multi_combat_mongap * 3);
        let sixth_pokemon_address = this.addresses.current_opponent_address + (this.addresses.multi_combat_mongap * 4);

        let first_data = await citra.readMemory(first_pokemon_address, 332);
        let second_data = await citra.readMemory(second_pokemon_address, 332);
        let third_data = await citra.readMemory(third_pokemon_address, 332);
        let fourth_data = await citra.readMemory(fourth_pokemon_address, 332);
        let fifth_data = await citra.readMemory(fifth_pokemon_address, 332);
        let sixth_data = await citra.readMemory(sixth_pokemon_address, 332);

        let first_dex_number = first_data.subarray(0, 2).readUInt16LE()
        let second_dex_number = second_data.subarray(0, 2).readUInt16LE()
        let third_dex_number = third_data.subarray(0, 2).readUInt16LE()
        let fourth_dex_number = fourth_data.subarray(0, 2).readUInt16LE()
        let fifth_dex_number = fifth_data.subarray(0, 2).readUInt16LE()
        let sixth_dex_number = sixth_data.subarray(0, 2).readUInt16LE()

        if (validatePokemon(sixth_dex_number) || validatePokemon(fifth_dex_number)) {
            if (this.combat_env === CombatEnv.WILD) {
                this.combat_type = CombatType.HORDE;
                return [CombatType.HORDE, [first_dex_number], [second_dex_number, third_dex_number, fourth_dex_number, fifth_dex_number, sixth_dex_number]];
            } else {
                this.combat_env = CombatEnv.MULTI;
                return [CombatType.TRIPLE, [first_dex_number, third_dex_number, fifth_dex_number], [second_dex_number, fourth_dex_number, sixth_dex_number]];
            }
        } else if (validatePokemon(third_dex_number) || validatePokemon(fourth_dex_number)) {
            if (this.combat_env === CombatEnv.WILD) {
                this.combat_type = CombatType.HORDE;
                return [CombatType.HORDE, [first_dex_number], [second_dex_number, third_dex_number, fourth_dex_number]];
            } else {
                this.combat_env = CombatEnv.MULTI;
                return [CombatType.DOUBLE, [first_dex_number, third_dex_number], [second_dex_number, fourth_dex_number]];
            }
        } else if (validatePokemon(first_dex_number) || validatePokemon(second_dex_number)) {
            return [CombatType.NORMAL, [first_dex_number], [second_dex_number]];
        }

        return [this.combat_type, this.ally_selected, this.enemy_selected];
    }

    async startComms(rom, game_data, citra) {
        this.addresses = await this.getAddresses(rom, citra)
        if (this.in_combat) {
            let move_log_address;
            if (this.combat_type === CombatType.NORMAL) {
                move_log_address = rom.log_addresses.move_log.single;
            } else if (this.combat_type === CombatType.DOUBLE) {
                move_log_address = rom.log_addresses.move_log.multi;
            }
            const combatLogMessageBytes = await citra.readMemory(0x8523114, 152);
            const combat_log_message = combatLogMessageBytes.toString('utf16le').replace('\n', ' ')
                .replace('\u0010\u0001븀', ' ')
                .split('\u0000')[0];
            const move_log_message = (await citra.readMemory(move_log_address, 152)).toString('utf16le')
                .replace('\n', ' ')
                .replace('\u0010', '')
                .replace('\u0002', '')
                .replace('\xC8', '')
                .replace('\x82', '')
                .replace('Ȃ', '')
                .replace('+ ȁ♣', '')
                .replace('♣', '')
                .replace('\u0010', '')
                .replace('\u0001', '')
                .replace('븀', '')
                .split('\u0000')[0].trim();

            if (!this.combat_log_messages.includes(combat_log_message)) {
                this.combat_log_messages.push(combat_log_message);
            }
            if (move_log_message) {
                const last_move = this.combat_move_log_messages[this.combat_move_log_messages.length - 1];
                if (last_move && last_move.message !== move_log_message) {
                    this.combat_move_log_messages.push({
                        key: this.combat_move_log_messages.length,
                        message: move_log_message
                    });
                } else if (!last_move) {
                    this.combat_move_log_messages.push({
                        key: this.combat_move_log_messages.length,
                        message: move_log_message
                    });
                }
            }

            if (combat_log_message.includes('va a sacar a ')) {
                const removed_trainer_thrash = combat_log_message.split('va a sacar a ')[1];
                const next_pokemon = removed_trainer_thrash.split('!')[0]
                this.next_pokemon = next_pokemon.toLowerCase();
            } else {
                this.next_pokemon = null;
            }

            let [combatType, allySelected, enemySelected] = await this.getCombatData(citra);
            this.combat_type = combatType;
            this.enemy_selected = enemySelected.filter(item => !!item).map(item => item.toString());
            this.ally_selected = allySelected;
            let combat_data_address = rom.getBattleDataAddress(this.combat_env);
            let total_combat_data_slots = 24;

            this.your_battle_data = [];
            this.enemy_battle_data = [];
            this.ally_npc_battle_data = [];

            // eslint-disable-next-line no-unused-vars
            let your_slots = [0, 1, 2, 3, 4, 5];
            // eslint-disable-next-line no-unused-vars
            const ally_npc_slots = [6, 7, 8, 9, 10, 11];
            // eslint-disable-next-line no-unused-vars
            const enemy_slots = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

            for (let slot = 0; slot < total_combat_data_slots; slot++) {
                let slot_address = combat_data_address + (slot * rom.mongap);
                let mon_data = await citra.readMemory(slot_address, rom.slot_data_size);
                let pokemon = new InBattlePokemonData(mon_data);
                if (pokemon && !validatePokemon(pokemon.dex_number)) {
                    continue
                }

                if (your_slots.includes(pokemon.battle_slot)) {
                    this.your_battle_data.push(pokemon);
                } else if (ally_npc_slots.includes(pokemon.battle_slot)) {
                    this.ally_npc_battle_data.push(pokemon);
                } else if (enemy_slots.includes(pokemon.battle_slot)) {
                    this.enemy_battle_data.push(pokemon);
                } else {
                    logger.error(`team not found for battle data slot ${slot} with data ${pokemon}`)
                }
            }

        } else {
            this.combat_type = CombatType.OFF;
            this.enemy_selected = [];
            this.ally_selected = [];
            this.combat_log_messages = [];
            this.next_pokemon = null;

            this.your_battle_data = [];
            this.enemy_battle_data = [];
            this.ally_npc_battle_data = [];
            if (this.combat_move_log_messages.length > 0) {
                save_combat_log('', this.combat_move_log_messages)
                this.combat_move_log_messages = [];
            }
        }
    }
}

export class PokemonGame {
    constructor() {
        this.alreadySent = null;
        this.rom = RAM_ROM;
        this.data = new GameData({
            your_data: {
                team: [],
                owner: TeamOwner.YOU,
                discovered_pokemons: [0, 1, 2, 3, 4, 5],
                is_enemy: false
            },
            ally_data: {
                team: [],
                owner: TeamOwner.ALLY,
                discovered_pokemons: [0, 1, 2, 3, 4, 5],
                is_enemy: false
            },
            enemy_data: {
                team: [],
                owner: TeamOwner.ENEMY,
                discovered_pokemons: [],
                is_enemy: true
            },
            combat_info: {
                combat_type: CombatType.OFF,
                in_combat: false,
                ally_selected: [],
                enemy_selected: []
            }
        });
    }

    startComms(ipc, save_file_path, win) {
        this.alreadySent = null;
        if (!this.data.is_communicating) {
            this.data.is_communicating = true;
            this.data.startComms(this.rom, ipc, this, save_file_path, win).catch(() => {
            });
        }
    }
}
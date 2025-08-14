import {CitraClient, InBattlePokemonData, PokemonTeamData} from '@/app/api/ram_editor'
import {CombatEnv, CombatType} from "@/app/api/ram_editor/RamAccesor";
import {decryptPokemonData as decryptData} from "@/app/api/lib/PokemonCrypt";
import {getSaveName, stopWatching, watchSave} from "@/app/api/save_editor";
import {logger, save_combat_log} from "@/app/api/handlers/logging";
import {validateBattleData, validatePokemon} from "@/app/api/lib/validators";
import {GLOBAL_CONFIG, RAM_ROM, RAM_ROM2 as rom} from "@/stores/back_constants";
import {session} from "@/stores/backend";
import config from "@/app/api/lib/config";

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

    async startComms(rom, ipc, pokemon_game, save_file_path) {
        let citra = new CitraClient();
        try {
            stopWatching();
        } catch (e) {
            console.error('=============================')
            console.error('Error ha ocurrido', e)
        }
        watchSave();
        try {
            this.comms_closed = false;
            let trainer_name;
            await citra.readMemory(0, 1).then(() => {
                trainer_name = getSaveName(save_file_path);
                ipc.reply('trainer_name', trainer_name);
            });

            while (this.is_communicating) {
                await this.manageChatLog(citra)
                await this.combat_info.startComms(rom, this, citra);
                await this.your_data.startComms(rom, this, this.combat_info.addresses.ally, this.combat_info.ally_selected, citra);
                await this.enemy_data.startComms(rom, this, this.combat_info.addresses.enemy, this.combat_info.enemy_selected, citra);
                await this.ally_data.startComms(rom, this, this.combat_info.addresses.ally, this.combat_info.ally_selected, citra);

                if (this.combat_info.combat_type !== CombatType.OFF && this.combat_info.combat_env !== CombatEnv.OFF) {
                    const enemy_data = Object.values(this.combat_info.enemy_battle_data);
                    if (enemy_data.length > 0) {
                        this.enemy_data.team = enemy_data;
                    }
                    this.ally_data.team = Object.values(this.combat_info.ally_npc_battle_data);

                    // eslint-disable-next-line no-unused-vars
                    for (const [slot, pkm] of Object.entries(this.combat_info.your_battle_data)) {
                        if (!pkm) {
                            continue
                        }

                        const possibles = this.your_data.team.filter(pokemon => pokemon && pokemon.dex_number === pkm.dex_number);
                        const team_pkm = possibles[0];
                        if (!team_pkm) {
                            continue;
                        }
                        pkm.pid = team_pkm.pid
                        pkm.nature_name = team_pkm.nature_name
                        pkm.nature_num = team_pkm.nature_num
                    }

                    this.your_data.team = Object.values(this.combat_info.your_battle_data);
                    this.detectCurrentCombat(this.enemy_data);
                }
                if (pokemon_game.alreadySent !== JSON.stringify(this)) {
                    ipc.reply('updated_game_data', this);
                    pokemon_game.alreadySent = JSON.stringify(this);
                }
            }
        } catch (e) {
            console.log(e)
            logger.error(e)
        } finally {
            ipc.reply('citra_connection_closed')
            this.is_communicating = false;
            this.comms_closed = true;
            console.log('e2')
            citra.socket.close()
        }
    }

    async manageImposterLog(chatMessage) {
        if (!chatMessage) {
            return;
        }

        const foundData = chatMessage.match(/Soy el \w+ IMPOSTOR DEL TRAMO \d/);

        const foundData2 = chatMessage.match(/yo era el \w+ IMPOSTOR DEL TRAMO 4/);
        if (!foundData && !foundData2) {
            return;
        }
        const alreadyFound = config.get('impostors');
        let imposterMsg;
        if (foundData) {
            imposterMsg = foundData[0].toString().toLowerCase();
        } else {
            imposterMsg = foundData2[0].toString().toLowerCase();
        }

        if (alreadyFound.includes(imposterMsg)) {
            return;
        }

        const response = await session.post('/api/trainers/register_imposter/', {
            message: imposterMsg
        }, {
            headers: {
                'Authorization': `Token ${GLOBAL_CONFIG.token}`,
                "Content-Type": 'multipart/form-data'
            }
        }).catch((res) => {
            console.log(res)
            console.log('Failed for Found a new one!')
        });

        if (response) {
            alreadyFound.push(imposterMsg);
            config.set('impostors', alreadyFound);
            console.log('Found a new one!');
        }
    }

    async manageChatLog(citra) {
        const chatMessage1 = await rom.readMessageBox(citra, rom.game_data.chat_address1, rom.game_data.chat_length);
        const chatMessage2 = await rom.readMessageBox(citra, rom.game_data.chat_address2, rom.game_data.chat_length);
        const chatMessage3 = await rom.readMessageBox(citra, rom.game_data.chat_address2 + 1, rom.game_data.chat_length);
        await this.manageImposterLog(chatMessage1);
        await this.manageImposterLog(chatMessage2);
        await this.manageImposterLog(chatMessage3);
        await this.manageLyssonWin(chatMessage1);
        await this.manageLyssonWin(chatMessage2);
        await this.manageLyssonWin(chatMessage3);
    }

    async manageLyssonWin(chatMessage) {
        if (!chatMessage) {
            return;
        }
        const lowerMsg = chatMessage.toLowerCase()
        const foundData = lowerMsg.match(rom.game_data.already_won_lysson_message);

        if (!foundData) {
            return;
        }

        const lysson_defeated = config.get('lysson_defeated');
        if (lysson_defeated) {
            return;
        }

        const response = await session.post('/api/trainers/register_lysson/', {
        }, {
            headers: {
                'Authorization': `Token ${GLOBAL_CONFIG.token}`,
                "Content-Type": 'multipart/form-data'
            }
        }).catch((res) => {
            console.log(res)
            console.log('Failed for Found a new one!')
        });

        if (response) {
            config.set('lysson_defeated', true);
        }
    }

    detectCurrentCombat(enemy_data) {

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
            console.log(game_data.combat_info.next_pokemon)
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
        this.turn_count = 0;
    }

    async getAddresses(rom, citra) {
        let read_address;
        let pp_address;
        let enemy_read_address;
        let enemy_pp_address;
        let current_opponent_address;
        let multi_combat_mongap;

        let wildData = await citra.readMemory(rom.battle_data.wild, rom.slot_data_size);
        let rawWildData = decryptData(wildData);
        let wildPP = (await citra.readMemory(rom.wildppadd, 1)).readUInt8(0);
        let wildDex = rawWildData.subarray(4).readUInt16LE()

        let trainerData = await citra.readMemory(rom.battleTrainerPartyAddress, rom.slot_data_size);
        let rawTrainerData = decryptData(trainerData);
        let trainerPP = (await citra.readMemory(rom.trainerppadd, 1)).readUInt8(0);
        let trainerDex = rawTrainerData.subarray(8).readUInt16LE()

        if (validatePokemon(trainerDex) && trainerPP < 65) {
            read_address = rom.battleTrainerPartyAddress;
            pp_address = rom.trainerppadd;
            enemy_read_address = rom.trainerOpponentPartyAddress;
            enemy_pp_address = rom.trainerppadd;
            current_opponent_address = rom.currentOpponentAddress;
            multi_combat_mongap = rom.multiCombatMonGap;

            this.combat_env = CombatEnv.TRAINER;
            this.in_combat = true;
        } else if (validatePokemon(wildDex) && wildPP < 65) {
            read_address = rom.partyAddress;
            pp_address = rom.wildppadd;
            enemy_read_address = rom.wildOpponentPartyAddress;
            enemy_pp_address = rom.wildppadd;
            current_opponent_address = rom.currentOpponentAddress;
            multi_combat_mongap = rom.multiCombatMonGap;

            this.combat_env = CombatEnv.WILD;
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

    async manageTrainerLog(citra, address) {
        const message = (await rom.readMessageBox(citra, address));
        if (!message) {
            return;
        }
    }

    async manageCombatLog(citra, address) {
        const message = (await rom.readMessageBox(citra, address))
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

        if (!message) {
            return;
        }

        if (!this.combat_log_messages.includes(message)) {
            this.combat_log_messages.push(message);
        }


        if (message.includes('va a sacar a ')) {
            const removed_trainer_thrash = message.split('va a sacar a ')[1];
            const next_pokemon_clean = removed_trainer_thrash.split('!')[0]
            this.next_pokemon = next_pokemon_clean.toLowerCase();
        } else {
            this.next_pokemon = null;
        }
    }

    async manageMoveLog(citra, address) {
        const message = (await rom.readMessageBox(citra, address))
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

        if (!message) {
            return;
        }

        const last_move = this.combat_move_log_messages[this.combat_move_log_messages.length - 1];
        if (message.includes('¿Qué debería hacer')) {
            if (!last_move || !last_move.message.includes('Turno ')) {
                this.combat_move_log_messages.push({
                    key: this.combat_move_log_messages.length,
                    message: `Turno ${++this.turn_count}`
                });
            }
        } else if (last_move && last_move.message !== message) {
            this.combat_move_log_messages.push({
                key: this.combat_move_log_messages.length,
                message: message
            });
        } else if (!last_move) {
            this.combat_move_log_messages.push({
                key: this.combat_move_log_messages.length,
                message: message
            });
        }

    }

    async startComms(rom, game_data, citra) {
        this.addresses = await this.getAddresses(rom, citra)
        if (this.in_combat) {
            let move_log_address;
            //let trainer_log_address;
            let combat_log_address;
            if (this.combat_type === CombatType.NORMAL) {
                move_log_address = rom.log_addresses.turn_log.single;
                combat_log_address = rom.log_addresses.combat_log.single;
                //trainer_log_address = rom.log_addresses.trainer_log.single;
            } else if (this.combat_type === CombatType.DOUBLE) {
                move_log_address = rom.log_addresses.move_log.multi;
                combat_log_address = rom.log_addresses.combat_log.multi;
                //trainer_log_address = rom.log_addresses.trainer_log.multi;
            }

            //await this.manageTrainerLog(citra, trainer_log_address);
            await this.manageCombatLog(citra, combat_log_address);
            await this.manageMoveLog(citra, move_log_address);

            let [combatType, allySelected, enemySelected] = await this.getCombatData(citra);
            this.combat_type = combatType;
            this.enemy_selected = enemySelected.filter(item => !!item).map(item => item.toString());
            this.ally_selected = allySelected;
            let combat_data_address = rom.getBattleDataAddress(this.combat_env);
            let total_combat_data_slots = 24;

            this.your_battle_data = {};
            this.enemy_battle_data = {};
            this.ally_npc_battle_data = {};

            let ally_slot_address = combat_data_address + (6 * rom.mongap);
            let ally_mon_data = await citra.readMemory(ally_slot_address, rom.slot_data_size);
            let ally_pokemon = new InBattlePokemonData(ally_mon_data);
            if (ally_pokemon && !validateBattleData(ally_pokemon)) {
                combat_data_address = rom.getBattleDataAddress(CombatEnv.TRAINER);
            }

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
                if (pokemon && !validateBattleData(pokemon)) {
                    continue
                }

                if (your_slots.includes(pokemon.battle_slot)) {
                    this.your_battle_data[pokemon.battle_slot] = pokemon;
                } else if (ally_npc_slots.includes(pokemon.battle_slot)) {
                    this.ally_npc_battle_data[pokemon.battle_slot] = pokemon;
                } else if (enemy_slots.includes(pokemon.battle_slot)) {
                    this.enemy_battle_data[pokemon.battle_slot] = pokemon;
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
            this.turn_count = 0;

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
                ipc.reply('citra_connection_closed')
            });
        }
    }
}
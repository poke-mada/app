import {PokemonTeamData, validatePokemon} from '@/api/PokemonTeamData'
import {InBattlePokemonData} from "@/api/InBattlePokemonData";
import {CitraClient} from '@/api/CitraClient'
import {decryptData} from "@/api/PokemonCrypt";
import {session} from "@/store";
import {getSaveName, watchSave} from "@/api/saveReader";

let SLOT_OFFSET = 484;
let SLOT_DATA_SIZE = 232;
let STAT_DATA_SIZE = 22;

const CombatType = Object.freeze({
    OFF: "OFF",
    HORDE: "HORDE",
    NORMAL: "NORMAL",
    DOUBLE: "DOUBLE",
    TRIPLE: "TRIPLE"
});

const CombatEnv = Object.freeze({
    OFF: "OFF",
    WILD: "WILD",
    TRAINER: "TRAINER",
    MULTI: "MULTI"
});

const TeamOwner = Object.freeze({
    YOU: 'YOU',
    ENEMY: 'ENEMY'
});

class GameData {
    constructor(options) {
        this.is_communicating = false;
        this.combat_info = new CombatData(options.combat_info);
        this.your_data = new TeamData(options.your_data);
        this.enemy_data = new TeamData(options.enemy_data);
    }

    async startComms(rom, ipc, pokemon_game, save_file_path) {
        let citra = new CitraClient();
        try {
            let trainer_name;
            await citra.readMemory(0,1).then(() => {
                trainer_name = getSaveName(save_file_path);
                ipc.reply('trainer_name', trainer_name);
                watchSave(save_file_path)
            });

            while (this.is_communicating) {
                await this.combat_info.startComms(rom, this, citra);
                await this.your_data.startComms(rom, this, this.combat_info.addresses.ally, this.combat_info.ally_selected, citra);
                await this.enemy_data.startComms(rom, this, this.combat_info.addresses.enemy, this.combat_info.enemy_selected, citra);

                let your_team_length = this.your_data.team.filter((pokemon) => pokemon && validatePokemon(pokemon.dex_number)).length
                for (let slot = 0; slot < your_team_length; slot++) {
                    let pokemon = this.your_data.team[slot];
                    if (!pokemon) continue;
                    pokemon.discovered = true;
                    pokemon.battle_data = this.combat_info.ally_battle_data[slot];
                }

                let enemy_team_length = this.enemy_data.team.filter((pokemon) => pokemon && validatePokemon(pokemon.dex_number)).length
                for (let slot = 0; slot < enemy_team_length; slot++) {
                    let pokemon = this.enemy_data.team[slot];
                    if (!pokemon) continue;
                    if (this.enemy_data.discovered_pokemons.includes(slot.toString())) {
                        pokemon.discovered = true;
                    }
                    pokemon.battle_data = this.combat_info.enemy_battle_data[slot];
                }

                if (pokemon_game.alreadySent !== JSON.stringify(this)) {
                    ipc.reply('updated_game_data', this);
                    pokemon_game.alreadySent = JSON.stringify(this);
                    // await session.post(`/update_team/${trainer_name}/`, {
                    //     data: {
                    //         team: this.your_data.team
                    //     }
                    // }).catch(()=> {
                    //     console.log("error")
                    // })
                }
            }
            // eslint-disable-next-line no-empty
        } catch (e) {
        } finally {
            citra.socket.close()
        }
    }
}

class TeamData {
    constructor(options) {
        // @ts-ignore
        this.owner = options.owner;
        this.team = options.team;
        this.selected_pokemon = [];
        this.discovered_pokemons = options.discovered_pokemons;
        this.is_enemy = options.is_enemy;
    }

    findSelectedMon(dex_number) {
        for (let slot in Object.keys(this.team)) {
            let pokemon = this.team[slot]
            if (!pokemon) {
                continue;
            }

            if (dex_number === pokemon.dex_number) {
                if (slot && this.discovered_pokemons.includes(slot.toString())) {
                    return slot;
                }
                this.discovered_pokemons.push(slot);
                return slot;
            }
        }
    }

    async startComms(rom, game_data, addresses, selected_pokemon_dex, citra) {
        await this.loadPokemonData(rom, game_data, addresses, citra);
        this.selected_pokemon = [];
        if (!game_data.combat_info.in_combat) {
            return;
        }


        for (const dex_number of selected_pokemon_dex) {
            let slot = this.findSelectedMon(dex_number);
            this.selected_pokemon.push(slot)
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
                    this.team[slot] = pokemon;
                } else {
                    this.team[slot] = null;
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
        this.ally_battle_data = [
        ];
        this.enemy_battle_data = [
        ];
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

        let trainerData = await citra.readMemory(rom.battleTrainerPartyAddress, rom.slot_data_size);
        let rawTrainerData = decryptData(trainerData);

        let wildPP = (await citra.readMemory(rom.wildppadd, 1)).readUInt8(0);
        let trainerPP = (await citra.readMemory(rom.trainerppadd, 1)).readUInt8(0);

        let wildDex = rawWildData.subarray(8).readUInt16LE()
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

        let first_dex_number = (await citra.readMemory(first_pokemon_address, 2)).readUInt16LE()
        let second_dex_number = (await citra.readMemory(second_pokemon_address, 2)).readUInt16LE()
        let third_dex_number = (await citra.readMemory(third_pokemon_address, 2)).readUInt16LE()
        let fourth_dex_number = (await citra.readMemory(fourth_pokemon_address, 2)).readUInt16LE()
        let fifth_dex_number = (await citra.readMemory(fifth_pokemon_address, 2)).readUInt16LE()
        let sixth_dex_number = (await citra.readMemory(sixth_pokemon_address, 2)).readUInt16LE()

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
            let [combatType, allySelected, enemySelected] = await this.getCombatData(citra);
            this.combat_type = combatType;
            this.enemy_selected = enemySelected;
            this.ally_selected = allySelected;
            let combat_data_address = rom.getBattleDataAddress(this.combat_env);
            let your_team_length = game_data.your_data.team.filter((pokemon) => pokemon && validatePokemon(pokemon.dex_number)).length
            for (let slot = 0; slot < your_team_length; slot++) {
                let slot_address = combat_data_address + (slot * rom.mongap)
                let mon_data = await citra.readMemory(slot_address, rom.slot_data_size)
                this.ally_battle_data[slot] = new InBattlePokemonData(rom, mon_data);
            }

            let enemy_team_length = game_data.enemy_data.team.filter((pokemon) => pokemon && validatePokemon(pokemon.dex_number)).length
            for (let slot = 0; slot < enemy_team_length; slot++) {
                let slot_address = combat_data_address + ((your_team_length + slot) * rom.mongap)
                let mon_data = await citra.readMemory(slot_address, rom.slot_data_size)
                this.enemy_battle_data[slot] = new InBattlePokemonData(rom, mon_data);
            }

        } else {
            this.combat_type = CombatType.OFF;
            this.enemy_selected = [];
            this.ally_selected = [];
            this.ally_battle_data = [];
            this.enemy_battle_data = [];
        }
    }
}

export class PokemonGame {
    constructor(rom) {
        this.alreadySent = null;
        this.rom = rom;
        this.data = new GameData({
            your_data: {
                team: [],
                owner: TeamOwner.YOU,
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

    startComms(ipc, save_file_path) {
        this.alreadySent = null;
        this.data.is_communicating = true;
        this.data.startComms(this.rom, ipc, this, save_file_path).catch(() => {

        });
    }

    stop() {
        this.data.is_communicating = false;
    }
}
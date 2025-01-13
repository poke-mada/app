import {PokemonTeamData} from "@/api/PokemonTeamData";
import {CitraClient} from "@/api/CitraClient";

let BLOCK_SIZE = 56
let SLOT_OFFSET = 484
let SLOT_DATA_SIZE = (8 + (4 * BLOCK_SIZE))
let STAT_DATA_OFFSET = 112
let STAT_DATA_SIZE = 22

export class RomData {
    constructor(name, partyaddress, battlewildpartyadd, battlewildoppadd, battletrainerpartyadd, battletraineroppadd, curoppadd, wildppadd, trainerppadd, multippadd, mongap, badgeaddress, multi_combat_mongap, slot_data_size, battle_data, pokemon_battle_data_addresses, pokemon_team_data_addresses) {
        this.name = name;
        this.partyAddress = partyaddress;
        this.battleWildPartyAddress = battlewildpartyadd;
        this.wildOpponentPartyAddress = battlewildoppadd;
        this.battleTrainerPartyAddress = battletrainerpartyadd;
        this.trainerOpponentPartyAddress = battletraineroppadd;
        this.currentOpponentAddress = curoppadd;
        this.wildppadd = wildppadd;
        this.trainerppadd = trainerppadd;
        this.multippadd = multippadd;
        this.mongap = mongap;
        this.badgeaddress = badgeaddress;
        this.multiCombatMonGap = multi_combat_mongap;
        this.slot_data_size = slot_data_size;
        this.battle_data = battle_data;
        this.battle_data_addresses = pokemon_battle_data_addresses;
        this.pokemon_team_data_addresses = pokemon_team_data_addresses;
    }

    getBattleDataAddress(combat_env) {
        try {
            return this.battle_data[combat_env.toLowerCase()]
        } catch (e) {
            return -1;
        }
    }
}

export const XY = new RomData(
    'X/Y',
    147725544,
    142625392,
    142622412,
    142622504,
    142625484,
    138545352,
    136331232,
    136338160,
    136352016,
    580,
    147236512,
    235568,
    332,
    {
        wild: 136330960,
        trainer: 136337888,
        multi: 136355224,
    },
    {
        dex_number: 0x4,
        battle_slot: 0x11,
        level: 0x10,
        form: 0x14B,
        gender: 0XFB,
        status: {
            burned: 0x24,
            paralized: 0x18,
            sleep: 0x1C,
            frozen: 0x20,
            poisoned: 0x28,
        },
        stats: {
            max_hp: 0x6,
            attack: 0xEE,
            defense: 0xF0,
            special_attack: 0xF2,
            special_defense: 0xF4,
            speed: 0xF6,
        },
        boosts: {
            attack: 0xFC,
            defense: 0xFD,
            special_attack: 0xFE,
            special_defense: 0xFF,
            speed: 0x100,
            accuracy: 0x101,
            evasion: 0x102,
        },
        types: 0xF8
    },
    {
    }
);
export const ROZA = new RomData(
    'OmegaRuby/AlphaSapphire',
    0x8CF727C,
    142625428,
    142628408,
    142622544,
    142625524,
    138620288,
    136332044,
    136338972,
    136359756,
    580,
    147250644,
    235568,
    332,
    {
        wild: 136331772,
        trainer: 136338700,
        multi: 136352556,
    },
    {
        dex_number: 0x4,
        battle_slot: 0x11,
        level: 0x10,
        form: 0x14B,
        gender: 0XFB,
        status: {
            burned: 0x24,
            paralized: 0x18,
            sleep: 0x1C,
            frozen: 0x20,
            poisoned: 0x28,
        },
        stats: {
            max_hp: 0x6,
            attack: 0xEE,
            defense: 0xF0,
            special_attack: 0xF2,
            special_defense: 0xF4,
            speed: 0xF6,
        },
        boosts: {
            attack: 0xFC,
            defense: 0xFD,
            special_attack: 0xFE,
            special_defense: 0xFF,
            speed: 0x100,
            accuracy: 0x101,
            evasion: 0x102,
        },
        types: 0xF8
    },
    {
    }
);
export const SM = new RomData(
    'Sun/Moon',
    0x34195E10,
    849782880,
    849779900,
    849884860,
    849887840,
    873818400,
    805345614,
    805345614,
    805345614,
    816,
    0,
    20528,
    562,
    {
        wild: 805316464,
        trainer: 805316464,
        multi: -1,
    },
    {
        form: 0x231,
        gender: 0X1DF,
        status: {
            burned: 0x38,
            paralized: 0x20,
            sleep: 0x28,
            frozen: 0x30,
            poisoned: 0x40,
        }
    },
    {
    }
);
export const USUM = new RomData(
    'UltraSun/UltraMoon',
    0x33F7FA44,
    848898144,
    848901124,
    849000124,
    849003104,
    871632240,
    805345614,
    805345614,
    805345614,
    816,
    0,
    20528,
    562,
    {
        wild: 805316464,
        trainer: 805316464,
        multi: -1,
    },
    {
        form: 0x231,
        gender: 0X1DF,
        status: {
            burned: 0x38,
            paralized: 0x20,
            sleep: 0x28,
            frozen: 0x30,
            poisoned: 0x40,
        }
    },
    {
    }
);

export async function getGame() {
    let games = [XY, ROZA, SM, USUM]
    let citra = new CitraClient();
    for (const game of games) {
        for (let slot = 0; slot < 6; slot++) {
            let read_address = game.partyAddress + (slot * SLOT_OFFSET)
            let pokemonData = await citra.readMemory(read_address, SLOT_DATA_SIZE);
            let statsData = await citra.readMemory(read_address + SLOT_DATA_SIZE + STAT_DATA_OFFSET, STAT_DATA_SIZE);
            let data = Buffer.concat([pokemonData, statsData]);
            let pokemon = new PokemonTeamData(citra, data, slot);
            if (pokemon.dex_number >= 1 && pokemon.dex_number <= 808) {
                return game
            }
        }
    }
    citra.socket.close()
    return XY;
}
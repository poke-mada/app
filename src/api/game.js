import {Citra} from "@/api/citra_api";
import {Pokemon} from "@/api/pokemon";

let BLOCK_SIZE = 56
let SLOT_OFFSET = 484
let SLOT_DATA_SIZE = (8 + (4 * BLOCK_SIZE))
let STAT_DATA_OFFSET = 112
let STAT_DATA_SIZE = 22
class Game {
    constructor(name, partyaddress, battlewildpartyadd, battlewildoppadd, battletrainerpartyadd, battletraineroppadd, curoppadd, wildppadd, trainerppadd, multippadd, mongap, badgeaddress) {
        this.name = name;
        this.partyaddress = partyaddress;
        this.battlewildpartyadd = battlewildpartyadd;
        this.battlewildoppadd = battlewildoppadd;
        this.battletrainerpartyadd = battletrainerpartyadd;
        this.battletraineroppadd = battletraineroppadd;
        this.curoppadd = curoppadd;
        this.wildppadd = wildppadd;
        this.trainerppadd = trainerppadd;
        this.multippadd = multippadd;
        this.mongap = mongap;
        this.badgeaddress = badgeaddress;
    }
}

export const XY = new Game(
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
);
export const ROZA = new Game(
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
    0x8C6DDD4,
);
export const SM = new Game(
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
);
export const USUM = new Game(
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
);

export async function getGame(citra){
    let games = [XY, ROZA, SM, USUM]
    for (const game of games) {
        for (let slot = 0; slot < 6; slot++) {
            let read_address = game.partyaddress + (slot * SLOT_OFFSET)
            let pokemonData = await citra.readMemory(read_address, SLOT_DATA_SIZE);
            let statsData = await citra.readMemory(read_address + SLOT_DATA_SIZE + STAT_DATA_OFFSET, STAT_DATA_SIZE);
            let data = Buffer.concat([pokemonData, statsData]);
            let pokemon = new Pokemon(data, slot);
            if (pokemon.dex_number >= 1 && pokemon.dex_number <= 808) {
                return game
            }
        }
    }
    return XY;
}
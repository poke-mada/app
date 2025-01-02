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
    136331232 + 20784,
    580,
    147236512,
);
export const ROZA = new Game(
    'OmegaRuby/AlphaSapphire',
    0x8CF727C,
    0x8CF727C - 6000000 + 812440,
    0x8CF727C - 6000000 + 815420,
    0x8CF727C - 6000000 + 809556,
    0x8CF727C - 6000000 + 812536,
    0x8CF727C - 0xAF2F5C + 0x22EA60,
    0x8CF727C - 0xAF2F5C - 20,
    0x8CF727C - 0xAF2F5C - 20 + 6928,
    0x8CF727C - 0xAF2F5C - 20 + 6928 + 20784,
    580,
    0x8C6DDD4,
);
export const SM = new Game(
    'Sun/Moon',
    0x34195E10,
    0x34195E10 - 30000000 + 5705168,
    0x34195E10 - 30000000 + 5702188,
    0x33F7FA44 - 30000000 + 7995384,
    0x33F7FA44 - 30000000 + 7998364,
    0x34195E10 - 68732064 + 68472752,
    0x34195E10 - 68732064 - 34,
    0x34195E10 - 68732064 - 34,
    0x34195E10 - 68732064 - 34,
    816,
    0,
);
export const USUM = new Game(
    'UltraSun/UltraMoon',
    0x33F7FA44,
    0x33F7FA44 - 30000000 + 7008668,
    0x33F7FA44 - 30000000 + 7011648,
    0x33F7FA44 - 30000000 + 7110648,
    0x33F7FA44 - 30000000 + 7113628,
    0x33F7FA44 - 0x3f760d4 + 66286592,
    0x33F7FA44 - 0x3f760d4 - 34,
    0x33F7FA44 - 0x3f760d4 - 34,
    0x33F7FA44 - 0x3f760d4 - 34,
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
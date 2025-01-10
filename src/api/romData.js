import {Pokemon} from "@/api/pokemon";
import {CitraClient} from "@/api/CitraClient";

let BLOCK_SIZE = 56
let SLOT_OFFSET = 484
let SLOT_DATA_SIZE = (8 + (4 * BLOCK_SIZE))
let STAT_DATA_OFFSET = 112
let STAT_DATA_SIZE = 22

export class RomData {
    constructor(name, partyaddress, battlewildpartyadd, battlewildoppadd, battletrainerpartyadd, battletraineroppadd, curoppadd, wildppadd, trainerppadd, multippadd, mongap, badgeaddress, multi_combat_mongap) {
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
    235568
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
            let pokemon = new Pokemon(citra, data, slot);
            if (pokemon.dex_number >= 1 && pokemon.dex_number <= 808) {
                return game
            }
        }
    }
    citra.socket.close()
    return XY;
}
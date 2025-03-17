import {PokemonTeamData} from "@/api/ram_editor/PokemonTeamData";
import {CitraClient} from "@/api/ram_editor/CitraClient";

let BLOCK_SIZE = 56
let SLOT_OFFSET = 484
let SLOT_DATA_SIZE = (8 + (4 * BLOCK_SIZE))
let STAT_DATA_OFFSET = 112
let STAT_DATA_SIZE = 22

export class RomData {
    constructor(name, partyaddress, battlewildpartyadd, battlewildoppadd, battletrainerpartyadd, battletraineroppadd, curoppadd, wildppadd, trainerppadd, multippadd, mongap, badgeaddress, multi_combat_mongap, slot_data_size, battle_data, pokemon_battle_data_addresses, pokemon_team_data_addresses, log_data, item_data) {
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
        this.log_addresses = log_data;
        this.item_data = item_data;
    }

    getBattleDataAddress(combat_env) {
        try {
            return this.battle_data[combat_env.toLowerCase()]
        } catch (e) {
            return -1;
        }
    }

    getBoxSlotAddress(box, slot) {
        const box_offset = this.box_data.boxes_address + (this.box_data.slot_length * 30 * box);
        return box_offset + (slot * this.box_data.slot_length)
    }

    getTeamSlotAddress(slot) {
        return this.team_data.party_address + (this.team_data.slot_length * slot);
    }
}

// if game=="X/Y":
// itmdl=[147236508,9952,10208,10640,11016,12616,0x67E852C]   #70F62C #67E892C xy trainers
// elif game=="OmegaRuby/AlphaSapphire":
// itmdl=[147250640,9952,10208,10640,11024,12624] #reverse-berries,meds,tms,keys,items
export const XY = new RomData(
    'X/Y',
    0x8CE1CE8,
    0x8804A70,
    0x8803ECC,
    0x8803F28,
    0x8804ACC,
    0x84208C8,
    0x8203FE0,
    0x8205AF0,
    0x8209110,
    580,
    0x8C6A6A0,
    235568,
    332,
    {
        wild: 0x8203ED0,
        trainer: 0x82059E0,
        multi: 0x8209D98,
    },
    {
        dex_number: 0x4,
        battle_slot: 0x11,
        level: 0x10,
        form: 0x14B,
        gender: 0xFB,
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
    },
    {
        combat_log: {
            single: 0x8523114,
            multi: 0,
        },
        trainer_log: {
            single: 0x8523C94,
            multi: 0,
        },
        move_log: {
            multi: 0x84CF064,
            single: 0x845C004
        }
    },
    {
        items: 0x8c6a69c,
        meds: 0x27e0,
        tms: 0x2990,
        berries: 0x26e0,
        keys: 0x3148,
    }
);

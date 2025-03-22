import {decryptPokemonData, encryptData} from "@/api/lib/PokemonCrypt";
import {SAVE_ROM} from '@/stores/back_constants'
import {truncateBuffer} from "@/api/ram_editor/RamData";
import {STATICS_URL} from "@/api/lib/poke-api";

// noinspection DuplicatedCode
export class SavePokemon {
    constructor(pokemonData) {
        const decryptedData = decryptPokemonData(pokemonData);
        this.decryptedData = decryptedData;
        this.pid = decryptedData.subarray(SAVE_ROM.pokemon_data.pid).readUInt16LE();
        this.dex_number = decryptedData.subarray(SAVE_ROM.pokemon_data.dex_number).readUInt16LE();
        this.form = decryptedData.subarray(SAVE_ROM.pokemon_data.form).readUInt8();
        this.held_item_num = decryptedData.subarray(SAVE_ROM.pokemon_data.held_item).readUInt8();
        this.ability_num = decryptedData.subarray(SAVE_ROM.pokemon_data.ability_num).readUInt8();
        this.nature_num = decryptedData.subarray(SAVE_ROM.pokemon_data.nature_num).readUInt8();
        this.level = decryptedData.subarray(SAVE_ROM.pokemon_data.level).readUInt8();
        this.mote = truncateBuffer(decryptedData.subarray(SAVE_ROM.pokemon_data.mote)).toString('utf16le')

        this.max_hp = decryptedData.subarray(SAVE_ROM.pokemon_data.max_hp).readUInt16LE();                     // Max HP

        this.ev_hp = decryptedData.subarray(SAVE_ROM.pokemon_data.ev_hp).readUInt8();
        this.ev_attack = decryptedData.subarray(SAVE_ROM.pokemon_data.ev_attack).readUInt8();
        this.ev_defense = decryptedData.subarray(SAVE_ROM.pokemon_data.ev_defense).readUInt8();
        this.ev_speed = decryptedData.subarray(SAVE_ROM.pokemon_data.ev_speed).readUInt8();
        this.ev_spatk = decryptedData.subarray(SAVE_ROM.pokemon_data.ev_spatk).readUInt8();
        this.ev_spdef = decryptedData.subarray(SAVE_ROM.pokemon_data.ev_spdef).readUInt8();

        let ivloc = decryptedData.subarray(SAVE_ROM.pokemon_data.ivs).readUint32LE();
        this.ivloc = ivloc;
        this.ivhp = ivloc & 31; // HP IV
        this.ivattack = (ivloc >> 5) & 31; // Attack IV
        this.ivdefense = (ivloc >> 10) & 31; // Defense IV
        this.ivspeed = (ivloc >> 15) & 31; // Speed IV
        this.ivspatk = (ivloc >> 20) & 31; // Special attack IV
        this.ivspdef = (ivloc >> 25) & 31; // Special defense IV

        // for (let move_data of SAVE_ROM.pokemon_data.moves) {
        //     let move_index = decryptedData.subarray(move_data.index).readUInt16LE();
        //     let pp = decryptedData.subarray(move_data.pp).readUInt8();
        // }
    }

    static getEmptySlot() {
        return encryptData(Buffer.alloc(260));
    }

    toOverlayData() {
        return {
            sprite_url: `${STATICS_URL}/sprites/master/sprites/pokemon/${this.dex_number}.png`,
            mote: this.mote
        }
    }
}
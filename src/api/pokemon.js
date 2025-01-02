import struct from 'python-struct';
import {decryptData} from "./CitraReader.js";
import {STATICS_URL} from './poke-api.js'
import {Movement} from "./movement.js";
import {readFileSync} from 'fs'

class Pokemon {

    constructor(data) {
        let raw_data = decryptData(data);
        this.dex_number = struct.unpack("<H", raw_data.subarray(0x8, 0xA))[0]
        if (this.dex_number === 0) return;

        this.move1 = Movement(0, struct.unpack("<H", raw_data.subarray(0x5A, 0x5C))[0], struct.unpack("<B", raw_data.subarray(0x62, 0x63))[0])
        this.move2 = Movement(1, struct.unpack("<H", raw_data.subarray(0x5C, 0x5E))[0], struct.unpack("<B", raw_data.subarray(0x63, 0x64))[0])
        this.move3 = Movement(2, struct.unpack("<H", raw_data.subarray(0x5E, 0x60))[0], struct.unpack("<B", raw_data.subarray(0x64, 0x65))[0])
        this.move4 = Movement(3, struct.unpack("<H", raw_data.subarray(0x60, 0x62))[0], struct.unpack("<B", raw_data.subarray(0x65, 0x66))[0])

        this.form = struct.unpack("B", raw_data.subarray(0x1D, 0x1E))[0]
        this.held_item_num = struct.unpack("<H", raw_data.subarray(0xA, 0xC))[0]
        //this.held_item_name = items[this.held_item_num]['name']
        this.ability_num = struct.unpack("B", raw_data.subarray(0x14, 0x15))[0]  // Ability
        this.nature_num = struct.unpack("B", raw_data.subarray(0x1C, 0x1D))[0]   // Nature
        this.friendship = struct.unpack("B", raw_data.subarray(0xCA, 0xCB))[0]   // Friendship
        this.level_met = struct.unpack("<H", raw_data.subarray(0xDD, 0xDF))[0]   // Level met
        this.level = struct.unpack("B", raw_data.subarray(0xEC, 0xED))[0]        // Current level
        this.cur_hp = struct.unpack("<H", raw_data.subarray(0xF0, 0xF2))[0]      // Current HP
        this.maxhp = struct.unpack("<H", raw_data.subarray(0xF2, 0xF4))[0]       // Max HP
        this.attack = struct.unpack("<H", raw_data.subarray(0xF4, 0xF6))[0]      // Attack stat
        this.defense = struct.unpack("<H", raw_data.subarray(0xF6, 0xF8))[0]     // Defense stat
        this.speed = struct.unpack("<H", raw_data.subarray(0xF8, 0xFA))[0]       // Speed stat
        this.spatk = struct.unpack("<H", raw_data.subarray(0xFA, 0xFC))[0]       // Special attack stat
        this.spdef = struct.unpack("<H", raw_data.subarray(0xFC, 0xFE))[0]       // Special defense stat
        this.evhp = struct.unpack("B", raw_data.subarray(0x1E, 0x1F))[0]         // HP EV
        this.evattack = struct.unpack("B", raw_data.subarray(0x1F, 0x20))[0]     // Attack EV
        this.evdefense = struct.unpack("B", raw_data.subarray(0x20, 0x21))[0]    // Defense EV
        this.evspeed = struct.unpack("B", raw_data.subarray(0x21, 0x22))[0]      // Speed EV
        this.evspatk = struct.unpack("B", raw_data.subarray(0x22, 0x23))[0]      // Special attack EV
        this.evspdef = struct.unpack("B", raw_data.subarray(0x23, 0x24))[0]      // Special defense EV
        let ivloc = struct.unpack("<I", raw_data.subarray(0x74, 0x78))[0]
        this.ivhp = (ivloc >> 0) & 0x1F                                          // HP IV
        this.ivattack = (ivloc >> 5) & 0x1F                                      // Attack IV
        this.ivdefense = (ivloc >> 10) & 0x1F                                    // Defense IV
        this.ivspeed = (ivloc >> 15) & 0x1F                                      // Speed IV
        this.ivspatk = (ivloc >> 20) & 0x1F                                      // Special attack IV
        this.ivspdef = (ivloc >> 25) & 0x1F                                      // Special defense IV
        this.sprite_url = STATICS_URL + `/sprites/master/sprites/pokemon/${this.dex_number}.png`;
        this.sprite_back_url = STATICS_URL + `/sprites/master/sprites/pokemon/back/${this.dex_number}.png`;
        this.statusbyte = struct.unpack("<B", raw_data.subarray(0xE8, 0xE9))[0]  // Status byte

        let pokedata = JSON.parse(readFileSync('./public/data/mon_data.json'));
        let pokemon = pokedata[this.dex_number];
        this.types = pokemon.types
    }
}

export {
    Pokemon
}
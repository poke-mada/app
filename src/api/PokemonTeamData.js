/* eslint-disable no-undef */
// noinspection JSUnresolvedVariable

import struct from 'python-struct';
import {decryptData} from "./PokemonCrypt";
import {STATICS_URL} from './poke-api'
import {Movement} from "./movement";
import {readFileSync} from 'fs'
import path from "path";

export function validatePokemon(dex_number) {
    return dex_number >= 1 && dex_number <= 808;
}

export class PokemonTeamData {
    cleanNickData(nickElements) {
        let result = '';
        for (let char of nickElements) {
            if (char === 0) {
                return result;
            } else {
                result += String.fromCharCode(char);
            }
        }

        return result;
    }

    constructor(move_data, data) {
        if (data[0] === 0) return;
        let raw_data = decryptData(data);
        this.dex_number = struct.unpack("<H", raw_data.subarray(8, 10))[0]
        if (this.dex_number === 0 || this.dex_number >= 808) {
            return;
        }
        this.held_item_num = struct.unpack("<H", raw_data.subarray(10, 12))[0]
        this.ability_num = struct.unpack("B", raw_data.subarray(20, 21))[0]  // Ability
        this.nature_num = struct.unpack("B", raw_data.subarray(28, 29))[0]   // Nature
        this.form = struct.unpack("B", raw_data.subarray(29, 30))[0]         // FORM: mega, mega-x, mega-y, alola...
        this.evhp = struct.unpack("B", raw_data.subarray(30, 31))[0]         // HP EV
        this.evattack = struct.unpack("B", raw_data.subarray(31, 32))[0]     // Attack EV
        this.evdefense = struct.unpack("B", raw_data.subarray(32, 33))[0]    // Defense EV
        this.evspeed = struct.unpack("B", raw_data.subarray(33, 34))[0]      // Speed EV
        this.evspatk = struct.unpack("B", raw_data.subarray(34, 35))[0]      // Special attack EV
        this.evspdef = struct.unpack("B", raw_data.subarray(35, 36))[0]      // Special defense EV
        let mote = struct.unpack("12<H", raw_data.subarray(64, 90))
        this.moves = []

        this.moves.push(Movement(this.held_item_num, this.ability_num, 0, raw_data.subarray(90).readUInt16LE(), raw_data.subarray(98).readUInt8(), move_data));
        this.moves.push(Movement(this.held_item_num, this.ability_num, 1, raw_data.subarray(92).readUInt16LE(), raw_data.subarray(99).readUInt8(), move_data));
        this.moves.push(Movement(this.held_item_num, this.ability_num, 2, raw_data.subarray(94).readUInt16LE(), raw_data.subarray(100).readUInt8(), move_data));
        this.moves.push(Movement(this.held_item_num, this.ability_num, 3, raw_data.subarray(96).readUInt16LE(), raw_data.subarray(101).readUInt8(), move_data));

        let ivloc = raw_data.subarray(116).readUint32LE()
        this.friendship = raw_data.subarray(202).readUInt8()                   // Friendship
        this.level_met = raw_data.subarray(221).readUInt16LE()                 // Level met
        this.statusbyte = raw_data.subarray(232).readUInt8()                   // Status byte
        this.level = raw_data.subarray(236).readUInt8()                        // Current level
        this.cur_hp = raw_data.subarray(240).readUInt16LE()                    // Current HP
        this.maxhp = raw_data.subarray(242).readUInt16LE()                     // Max HP
        this.attack = raw_data.subarray(244).readUInt16LE()                    // Attack stat
        this.defense = raw_data.subarray(246).readUInt16LE()                   // Defense stat
        this.speed = raw_data.subarray(248).readUInt16LE()                     // Speed stat
        this.spatk = raw_data.subarray(250).readUInt16LE()                     // Special attack stat
        this.spdef = raw_data.subarray(252).readUInt16LE()                     // Special defense stat
        this.ivhp = ivloc & 31                                                 // HP IV
        this.ivattack = (ivloc >> 5) & 31                                      // Attack IV
        this.ivdefense = (ivloc >> 10) & 31                                    // Defense IV
        this.ivspeed = (ivloc >> 15) & 31                                      // Speed IV
        this.ivspatk = (ivloc >> 20) & 31                                      // Special attack IV
        this.ivspdef = (ivloc >> 25) & 31                                      // Special defense IV
        this.sprite_url = STATICS_URL + `/sprites/master/sprites/pokemon/${this.dex_number}.png`;
        this.mote = this.cleanNickData(mote);
        let mon_data_file = readFileSync(path.join(__static, 'data', 'mon_data.json')).toString();
        let pokemon_forms_data_file = readFileSync(path.join(__static, 'data', 'pokemon_forms.json')).toString();
        let item_data_file = readFileSync(path.join(__static, 'data', 'item_data.json')).toString();
        let ability_data_file = readFileSync(path.join(__static, 'data', 'ability_data.json')).toString();
        let nature_data_file = readFileSync(path.join(__static, 'data', 'nature_data.json')).toString();
        let item_data = JSON.parse(item_data_file);
        let ability_data = JSON.parse(ability_data_file);
        let nature_data = JSON.parse(nature_data_file);
        let pokedata = JSON.parse(mon_data_file);
        let formdata = JSON.parse(pokemon_forms_data_file);
        let pokemon;

        this.ability_name = ability_data[this.ability_num].name;
        this.nature_name = nature_data[this.nature_num].name;
        this.item_name = item_data[this.held_item_num].name;

        try {
            if (this.dex_number in formdata) {
                let form = formdata[this.dex_number][this.form];
                if (form in pokedata[this.dex_number]) {
                    pokemon = pokedata[this.dex_number][form];
                } else {
                    pokemon = pokedata[this.dex_number]["0"]
                }
            } else {
                pokemon = pokedata[this.dex_number]["0"]
            }
        } catch (e) {
            console.error('failed for pokemon dex: ', this.dex_number)
            return;
        }

        this.species = pokemon.name;
        this.types = pokemon.types.map((value) => {
            return {name: value.name.toLowerCase()}
        })
    }

    isAlive() {
        return this.cur_hp >= 0;
    }
}

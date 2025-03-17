/* eslint-disable no-undef */
// noinspection JSUnresolvedVariable

import {decryptPokemonData} from "@/api/lib/PokemonCrypt";
import {STATICS_URL} from '@/api/lib/poke-api'
import {Movement} from "@/api/ram_editor/movement";
import {MON_DATA, ITEM_DATA, ABILITY_DATA, NATURE_DATA, POKEMON_FORMS_DATA} from '@/data/mon_data';
import {truncateBuffer} from "@/api/ram_editor/RamData";

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

    setBattleData(newBattleData) {
        this.battle_data = newBattleData;
    }

    constructor(move_data, data, debug=false) {
        if (data[0] === 0) return;
        let raw_data = decryptPokemonData(data);
        this.dex_number = raw_data.subarray(8, 10).readUInt16LE()

        if (this.dex_number === 0 || this.dex_number >= 808) {
            return;
        }
        if (debug) {
            console.log(this.dex_number)
        }
        this.held_item_num = raw_data.subarray(10).readUInt16LE()
        this.ability_num = raw_data.subarray(20).readUInt8()  // Ability
        this.nature_num = raw_data.subarray(28).readUInt8()   // Nature
        this.form = raw_data.subarray(29).readUInt8()         // FORM: mega, mega-x, mega-y, alola...
        this.evhp = raw_data.subarray(30).readUInt8()         // HP EV
        this.evattack = raw_data.subarray(31).readUInt8()     // Attack EV
        this.evdefense = raw_data.subarray(32).readUInt8()    // Defense EV
        this.evspeed = raw_data.subarray(33).readUInt8()      // Speed EV
        this.evspatk = raw_data.subarray(34).readUInt8()      // Special attack EV
        this.evspdef = raw_data.subarray(35).readUInt8()      // Special defense EV
        this.mote = truncateBuffer(raw_data.subarray(64, 90)).toString('utf16le');
        this.moves = []

        this.moves.push(Movement(this.held_item_num, this.ability_num, 0, raw_data.subarray(90).readUInt16LE(), raw_data.subarray(98).readUInt8(), move_data));
        this.moves.push(Movement(this.held_item_num, this.ability_num, 1, raw_data.subarray(92).readUInt16LE(), raw_data.subarray(99).readUInt8(), move_data));
        this.moves.push(Movement(this.held_item_num, this.ability_num, 2, raw_data.subarray(94).readUInt16LE(), raw_data.subarray(100).readUInt8(), move_data));
        this.moves.push(Movement(this.held_item_num, this.ability_num, 3, raw_data.subarray(96).readUInt16LE(), raw_data.subarray(101).readUInt8(), move_data));

        this.discovered = true;
        this.friendship = raw_data.subarray(202).readUInt8()                   // Friendship
        this.level_met = raw_data.subarray(221).readUInt16LE()                 // Level met
        this.statusbyte = raw_data.subarray(232).readUInt8()                   // Status byte
        this.level = raw_data.subarray(236).readUInt8()                        // Current level

        this.cur_hp = raw_data.subarray(240).readUInt16LE()                    // Current HP final stat
        this.maxhp = raw_data.subarray(242).readUInt16LE()                     // Max HP final stat
        this.attack = raw_data.subarray(244).readUInt16LE()                    // Attack final stat
        this.defense = raw_data.subarray(246).readUInt16LE()                   // Defense final stat
        this.speed = raw_data.subarray(248).readUInt16LE()                     // Speed final stat
        this.spatk = raw_data.subarray(250).readUInt16LE()                     // Special attack final stat
        this.spdef = raw_data.subarray(252).readUInt16LE()                     // Special defense final stat

        let ivloc = raw_data.subarray(116).readUint32LE()
        this.ivhp = ivloc & 0b11111                                                 // HP IV
        this.ivattack = (ivloc >> 5) & 0b11111                                      // Attack IV
        this.ivdefense = (ivloc >> 10) & 0b11111                                    // Defense IV
        this.ivspeed = (ivloc >> 15) & 0b11111                                      // Speed IV
        this.ivspatk = (ivloc >> 20) & 0b11111                                      // Special attack IV
        this.ivspdef = (ivloc >> 25) & 0b11111                                      // Special defense IV
        this.sprite_url = STATICS_URL + `/sprites/master/sprites/pokemon/${this.dex_number}.png`;
        let pokemon;

        let ability;
        let nature;
        let item;
        try {
            ability = ABILITY_DATA[this.ability_num.toString()];
            nature = NATURE_DATA[this.nature_num.toString()];
            item = ITEM_DATA[this.held_item_num.toString()];

            this.ability_name = ability.name;
            this.nature_name = nature.name;
            this.item_name = item.name;
        } catch (e) {
            console.log('error while getting ability, nature and item names');
            console.log(this.ability_num, this.nature_num, this.held_item_num);
            console.log(ability, nature, item);
        }

        try {
            if (this.dex_number in POKEMON_FORMS_DATA) {
                let form = POKEMON_FORMS_DATA[this.dex_number.toString()][this.form.toString()];
                if (form in MON_DATA[this.dex_number.toString()]) {
                    pokemon = MON_DATA[this.dex_number.toString()][form.toString()];
                } else {
                    pokemon = MON_DATA[this.dex_number.toString()]["0"]
                }
            } else {
                pokemon = MON_DATA[this.dex_number.toString()]["0"]
            }
        } catch (e) {
            console.log(e)
            console.error('failed for pokemon dex: ', this.dex_number)
            return;
        }

        this.species = pokemon.name;
        this.types = pokemon.types.map((value) => {
            return {name: value.name.toLowerCase()}
        });
    }

    isAlive() {
        return this.cur_hp >= 0;
    }
}
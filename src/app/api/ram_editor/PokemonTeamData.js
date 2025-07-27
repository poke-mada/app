/* eslint-disable no-undef */
// noinspection JSUnresolvedVariable

import {decryptPokemonData} from "@/app/api/lib/PokemonCrypt";
import {STATICS_URL} from '@/app/api/lib/poke-api'
import {Movement} from "@/app/api/ram_editor/movement";
import {MON_DATA, ITEM_DATA, ABILITY_DATA, NATURE_DATA, POKEMON_FORMS_DATA} from '@/data/mon_data';
import {truncateBuffer} from "@/app/api/ram_editor/RamData";
import {RAM_ROM2} from "@/stores/back_constants";
import {WEAKNESS_DATA} from "@/data/type_data";

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

    constructor(move_data, data) {
        let raw_data = decryptPokemonData(data);
        this.dex_number = raw_data.subarray(8, 10).readUInt16LE()

        if (this.dex_number === 0 || this.dex_number >= 822) {
            return;
        }

        this.pid = raw_data.subarray(RAM_ROM2.pokemon_data.pid).readUint32LE()
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

        this.moves.push(Movement(this.held_item_num, this.ability_num, 0, raw_data.subarray(90).readUInt16LE()));
        this.moves.push(Movement(this.held_item_num, this.ability_num, 1, raw_data.subarray(92).readUInt16LE()));
        this.moves.push(Movement(this.held_item_num, this.ability_num, 2, raw_data.subarray(94).readUInt16LE()));
        this.moves.push(Movement(this.held_item_num, this.ability_num, 3, raw_data.subarray(96).readUInt16LE()));

        this.discovered = true;
        this.friendship = raw_data.subarray(0xca).readUInt8()                   // Friendship
        this.level_met = raw_data.subarray(0xdd).readUInt16LE()                 // Level met
        this.statusbyte = raw_data.subarray(0xe8).readUInt8()                   // Status byte
        this.level = raw_data.subarray(0xec).readUInt8()                        // Current level

        this.cur_hp = raw_data.subarray(0xf0).readUInt16LE()                    // Current HP final stat
        this.maxhp = raw_data.subarray(0xf2).readUInt16LE()                     // Max HP final stat
        this.attack = raw_data.subarray(0xf4).readUInt16LE()                    // Attack final stat
        this.defense = raw_data.subarray(0xf6).readUInt16LE()                   // Defense final stat
        this.speed = raw_data.subarray(0xf8).readUInt16LE()                     // Speed final stat
        this.spatk = raw_data.subarray(0xfa).readUInt16LE()                     // Special attack final stat
        this.spdef = raw_data.subarray(0xfc).readUInt16LE()                     // Special defense final stat

        let ivloc = raw_data.subarray(0x74).readUint32LE()
        this.ivhp = ivloc & 0b11111                                                 // HP IV
        this.ivattack = (ivloc >> 5) & 0b11111                                      // Attack IV
        this.ivdefense = (ivloc >> 10) & 0b11111                                    // Defense IV
        this.ivspeed = (ivloc >> 15) & 0b11111                                      // Speed IV
        this.ivspatk = (ivloc >> 20) & 0b11111                                      // Special attack IV
        this.ivspdef = (ivloc >> 25) & 0b11111                                      // Special defense IV
        this.sprite_url = `${STATICS_URL}/sprites/master/sprites/pokemon/${this.dex_number}.png`;
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

        let types = pokemon.types;

        let weaknesses = {};
        for (const type of types) {
            if (!type.name) {
                continue
            }
            let weak = WEAKNESS_DATA[type.name.toLowerCase()];
            for (const weakness of weak.double_from) {
                if (weakness in weaknesses) {
                    weaknesses[weakness] *= 2;
                } else {
                    weaknesses[weakness] = 2;
                }
            }
            for (const weakness of weak.zero_from) {
                weaknesses[weakness] = 0;
            }
            for (const weakness of weak.half_from) {
                if (weakness in weaknesses) {
                    weaknesses[weakness] /= 2;
                } else {
                    weaknesses[weakness] = 0.5;
                }
            }
        }

        // eslint-disable-next-line no-unused-vars
        this.weaknesses = Object.entries(weaknesses).filter(([type, multiplier]) => multiplier !== 1).map(([type, multiplier]) => {
            return {name: type, multiplier: multiplier}
        })

        this.types = pokemon.types.map((value) => {
            return {name: value.name.toLowerCase()}
        });
        this.suffix = this.getSuffix(this.dex_number, this.form)
    }

    getSuffix(dexNumber, form) {
        switch (dexNumber) {
            case 641:
            case 642:
            case 645:
                return form > 0 ? "therian" : "incarnate";

            case 6:
                if (form === 8 || form === 10) return "mega-x";
                if (form === 16 || form === 18) return "mega-y";
                break;

            case 20:
                if (form === 0 || form === 2) return null;
                return "alola";

            case 25:
                if (form === 0 || form === 2) return null;
                return "partner";

            case 105:
                if (form === 0 || form === 2) return null;
                return "alola";

            case 150:
                if (form === 4) return null;
                if (form === 12) return "mega-x";
                if (form === 20) return "mega-y";
                break;

            case 151:
            case 201:
            case 412:
            case 414:
            case 421:
            case 422:
            case 423:
            case 550:
            case 585:
            case 586:
            case 647:
            case 649:
            case 671:
            case 676:
            case 684:
            case 716:
            case 801:
                return null;

            case 351:
                if (form === 8 || form === 10) return "sunny";
                if (form === 16 || form === 18) return "rainy";
                if (form === 24 || form === 26) return "snowy";
                break;

            case 382:
            case 383:
                if (form === 12) return "primal";
                break;

            case 386:
                if (form === 4) return null;
                if (form === 12) return "attack";
                if (form === 20) return "defense";
                if (form === 28) return "speed";
                break;

            case 413:
                if (form === 10) return "sandy";
                if (form === 18) return "trash";
                if (form === 2) return "plant";
                break;

            case 479:
                if (form === 12) return "heat";
                if (form === 20) return "wash";
                if (form === 28) return "frost";
                if (form === 36) return "fan";
                if (form === 44) return "mow";
                break;

            case 487:
                if (form === 12) return "origin";
                break;

            case 492:
                if (form === 12) return "sky";
                break;

            case 555:
                if (form === 0) return "standard";
                if (form === 2) return "standard";
                if (form === 1) return "zen";
                if (form === 3) return "zen";
                return null;

            case 646:
                if (form === 12) return "white";
                if (form === 20) return "black";
                break;

            case 648:
                if (form === 12) return "pirouette";
                if (form === 4) return "aria";
                break;

            case 658:
                if (form === 8 || form === 16) return "ash";
                break;

            case 664:
            case 665:
            case 666:
            case 669:
                return null;

            case 670:
                if (form === 42) return "eternal";
                return null;

            case 678:
                if (form === 10) return "f";
                return null;

            case 681:
                if (form === 0 || form === 2) return "shield";
                if (form === 8 || form === 10) return "blade";
                break;

            case 710:
            case 711:
                if (form === 8 || form === 10) return "average";
                if (form === 16 || form === 18) return "large";
                if (form === 24 || form === 26) return "super";
                return null;

            case 718:
                if (form === 12) return "10";
                if (form === 20 || form === 36) return "complete";
                return null;

            case 720:
                if (form === 12) return "unbound";
                return null;

            case 741:
                if (form === 8 || form === 10) return "pom-pom";
                if (form === 16 || form === 18) return "pau";
                if (form === 24 || form === 26) return "sensu";
                return "baile";

            case 745:
                if (form === 16 || form === 18) return "dusk";
                if (form === 8 || form === 10) return "midnight";
                break;

            case 746:
                if (form === 0 || form === 2) return null;
                return "school";

            case 774:
                if ([12, 20, 28, 36, 44, 52, 60].includes(form)) return "core";
                break;

            case 800:
                if (form === 12) return "dusk";
                if (form === 20) return "dawn";
                if (form === 28) return "ultra";
                return null;

            case 19:
            case 26:
            case 27:
            case 28:
            case 37:
            case 38:
            case 50:
            case 51:
            case 52:
            case 53:
            case 74:
            case 75:
            case 76:
            case 88:
            case 89:
            case 103:
                if ([8, 10, 12].includes(form)) return "alola";
                return null;

            case 735:
            case 738:
            case 743:
            case 752:
            case 754:
            case 758:
            case 777:
            case 778:
            case 784:
                return null;

            default:
                if (form > 0 && form !== 2 && form !== 4) return "mega";
                return null;
        }
    }


    isAlive() {
        return this.cur_hp >= 0;
    }
}
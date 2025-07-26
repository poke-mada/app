import {STATICS_URL} from "@/app/api/lib/poke-api";
import {ABILITY_DATA, ITEM_DATA, MON_DATA} from '@/data/mon_data';
import {validatePokemon} from "@/app/api/lib/validators";
import {RAM_ROM2 as rom} from '@/stores/back_constants';
import {WEAKNESS_DATA} from '@/data/type_data';
import {Movement} from "@/app/api/ram_editor/movement";

export class InBattlePokemonData {
    constructor(data) {
        this.original_data = data;
        this.dex_number = data.slice(rom.pokemon_battle_data.dex_number).readUInt16LE()
        if (this.dex_number === 0 || this.dex_number >= 822) {
            this.stats = {};
            this.moves = [];
            this.boosts = {};
            this.weaknesses = [];
            return;
        }
        this.battle_slot = data.slice(rom.pokemon_battle_data.battle_slot).readUInt8()
        this.form = data.slice(rom.pokemon_battle_data.form).readUInt8()
        this.level = data.slice(rom.pokemon_battle_data.level).readUInt8()
        this.current_hp = data.slice(rom.pokemon_battle_data.current_hp).readUInt16LE()
        this.stats = {
            max_hp: data.slice(rom.pokemon_battle_data.stats.max_hp).readUInt16LE(),
            attack: data.slice(rom.pokemon_battle_data.stats.attack).readUInt16LE(),
            defense: data.slice(rom.pokemon_battle_data.stats.defense).readUInt16LE(),
            special_attack: data.slice(rom.pokemon_battle_data.stats.special_attack).readUInt16LE(),
            special_defense: data.slice(rom.pokemon_battle_data.stats.special_defense).readUInt16LE(),
            speed: data.slice(rom.pokemon_battle_data.stats.speed).readUInt16LE(),
        }

        this.held_item_num = data.subarray(rom.pokemon_battle_data.item).readUInt16LE()
        this.ability_num = data.subarray(rom.pokemon_battle_data.ability).readUInt8()  // Ability

        this.moves = [];

        this.moves.push(Movement(this.held_item_num, this.ability_num, 0, data.subarray(rom.pokemon_battle_data.moves.address +  0).readUInt16LE()));
        this.moves.push(Movement(this.held_item_num, this.ability_num, 1, data.subarray(rom.pokemon_battle_data.moves.address + 14).readUInt16LE()));
        this.moves.push(Movement(this.held_item_num, this.ability_num, 2, data.subarray(rom.pokemon_battle_data.moves.address + 28).readUInt16LE()));
        this.moves.push(Movement(this.held_item_num, this.ability_num, 3, data.subarray(rom.pokemon_battle_data.moves.address + 42).readUInt16LE()));

        let is_burned = data.slice(rom.pokemon_battle_data.status.burned).readUInt8() === 1;
        this.is_burned = is_burned;
        let is_paralized = data.slice(rom.pokemon_battle_data.status.paralized).readUInt8() === 1;
        this.is_paralized = is_paralized;
        let is_sleep = data.slice(rom.pokemon_battle_data.status.sleep).readUInt8() === 1;
        this.is_sleep = is_sleep;
        let is_frozen = data.slice(rom.pokemon_battle_data.status.frozen).readUInt8() === 1;
        this.is_frozen = is_frozen;
        let is_poisoned = data.slice(rom.pokemon_battle_data.status.poisoned).readUInt8() === 1;
        this.is_poisoned = is_poisoned;

        this.status = ''

        if (is_burned) {
            this.status = 'Burned';
        } else if (is_paralized) {
            this.status = 'Paralized';
        } else if (is_sleep) {
            this.status = 'Sleep';
        } else if (is_frozen) {
            this.status = 'Frozen';
        } else if (is_poisoned) {
            this.status = 'Poisoned';
        }

        this.boosts = {
            attack: data.slice(rom.pokemon_battle_data.boosts.attack).readUInt8() - 6,
            defense: data.slice(rom.pokemon_battle_data.boosts.defense).readUInt8() - 6,
            special_attack: data.slice(rom.pokemon_battle_data.boosts.special_attack).readUInt8() - 6,
            special_defense: data.slice(rom.pokemon_battle_data.boosts.special_defense).readUInt8() - 6,
            speed: data.slice(rom.pokemon_battle_data.boosts.speed).readUInt8() - 6,
            accuracy: data.slice(rom.pokemon_battle_data.boosts.accuracy).readUInt8() - 6,
            evasion: data.slice(rom.pokemon_battle_data.boosts.evasion).readUInt8() - 6
        }

        this.type1 = data.slice(rom.pokemon_battle_data.types).readUInt8();
        let type1 = types_by_index[this.type1];

        this.type2 = data.slice(rom.pokemon_battle_data.types + 1).readUInt8();
        let type2 = types_by_index[this.type2];

        this.type3 = data.slice(rom.pokemon_battle_data.types + 2).readUInt8();
        let type3 = types_by_index[this.type3];


        let types = [{name: type1}]
        if (type1 !== type2) {
            types.push({name: type2})
        }
        if (type3 && type1 !== type3 && type2 !== type3) {
            types.push({name: type3})
        }

        this.types = types;

        let weaknesses = {};
        for (const type of types) {
            if (type && !type.name) {
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

        let ability;
        let item;
        try {
            ability = ABILITY_DATA[this.ability_num.toString()];
            item = ITEM_DATA[this.held_item_num.toString()];

            this.ability_name = ability.name;
            this.item_name = item.name;
        } catch (e) {
            console.log('==========================================')
            console.log('error while getting ability and item names');
            console.log('FAIILED FOR', this.dex_number)
            console.log('ability_num', this.ability_num);
            console.log('held_item_num', this.held_item_num)
            console.log('ability', ability);
            console.log('item', item);
        }

        if (validatePokemon(this.dex_number)) {
            try {
                this.species = MON_DATA[this.dex_number.toString()][this.form].name;
                this.mote = MON_DATA[this.dex_number.toString()][this.form].name;
            } catch (e) {
                this.species = MON_DATA[this.dex_number.toString()]['0'].name;
                this.mote = MON_DATA[this.dex_number.toString()]['0'].name;
            }
        } else {
            this.species = 'Invalid-Pokemon';
        }
        this.sprite_url = STATICS_URL + `/sprites/master/sprites/pokemon/${this.dex_number}.png`;

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

    toWrittableBytes() {
        const bytes = Buffer.alloc(this.original_data.length)
        this.original_data.copy(bytes, 0, 0, this.original_data.length)

        bytes.writeUint8(this.boosts.attack + 6, rom.pokemon_battle_data.boosts.attack)
        bytes.writeUint8(this.boosts.defense + 6, rom.pokemon_battle_data.boosts.defense)
        bytes.writeUint8(this.boosts.special_attack + 6, rom.pokemon_battle_data.boosts.special_attack)
        bytes.writeUint8(this.boosts.special_defense + 6, rom.pokemon_battle_data.boosts.special_defense)
        bytes.writeUint8(this.boosts.speed + 6, rom.pokemon_battle_data.boosts.speed)
        bytes.writeUint8(this.boosts.accuracy + 6, rom.pokemon_battle_data.boosts.accuracy)
        bytes.writeUint8(this.boosts.evasion + 6, rom.pokemon_battle_data.boosts.evasion)

        bytes.writeUint8(this.is_burned ? 1 : 0, rom.pokemon_battle_data.status.burned)
        bytes.writeUint8(this.is_paralized ? 1 : 0, rom.pokemon_battle_data.status.paralized)
        bytes.writeUint8(this.is_sleep ? 1 : 0, rom.pokemon_battle_data.status.sleep)
        bytes.writeUint8(this.is_frozen ? 1 : 0, rom.pokemon_battle_data.status.frozen)
        bytes.writeUint8(this.is_poisoned ? 1 : 0, rom.pokemon_battle_data.status.poisoned)

        return bytes;

    }
}

const types_by_index = {
    "0": "Normal",
    "1": "Fighting",
    "2": "Flying",
    "3": "Poison",
    "4": "Ground",
    "5": "Rock",
    "6": "Bug",
    "7": "Ghost",
    "8": "Steel",
    "9": "Fire",
    "10": "Water",
    "11": "Grass",
    "12": "Electric",
    "13": "Psychic",
    "14": "Ice",
    "15": "Dragon",
    "16": "Dark",
    "17": "Fairy",
}
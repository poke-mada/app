import {STATICS_URL} from "@/api/lib/poke-api";
import {MON_DATA} from '@/data/mon_data';
import {validatePokemon} from "@/api/lib/validators";
import {RAM_ROM2 as rom} from '@/stores/back_constants'

export class InBattlePokemonData {
    constructor(data) {
        this.original_data = data;
        this.dex_number = data.slice(rom.pokemon_battle_data.dex_number).readUInt16LE()

        this.battle_slot = data.slice(rom.pokemon_battle_data.battle_slot).readUInt8()
        this.form = data.slice(rom.pokemon_battle_data.form).readUInt8()
        this.level = data.slice(rom.pokemon_battle_data.level).readUInt8()
        this.stats = {
            max_hp: data.slice(rom.pokemon_battle_data.stats.max_hp).readUInt16LE(),
            attack: data.slice(rom.pokemon_battle_data.stats.attack).readUInt16LE(),
            defense: data.slice(rom.pokemon_battle_data.stats.defense).readUInt16LE(),
            special_attack: data.slice(rom.pokemon_battle_data.stats.special_attack).readUInt16LE(),
            special_defense: data.slice(rom.pokemon_battle_data.stats.special_defense).readUInt16LE(),
            speed: data.slice(rom.pokemon_battle_data.stats.speed).readUInt16LE(),
        }

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


        this.types = [{name: type1}]
        if (type1 !== type2) {
            this.types.push({name: type2})
        }
        if (type3 && type1 !== type3 && type2 !== type3) {
            this.types.push({name: type3})
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
    }

    toWrittableBytes() {
        const bytes = Buffer.alloc(this.original_data.length)
        this.original_data.copy(bytes, 0, 0, this.original_data.length)

        // bytes.writeUint16LE(this.dex_number, rom.pokemon_battle_data.dex_number);
        // bytes.writeUint8(this.battle_slot, rom.pokemon_battle_data.battle_slot);
        // bytes.writeUint8(this.form, rom.pokemon_battle_data.form)
        // bytes.writeUint8(this.level, rom.pokemon_battle_data.level)

        // bytes.writeUint16LE(this.stats.max_hp, rom.pokemon_battle_data.stats.max_hp)
        // bytes.writeUint16LE(this.stats.attack, rom.pokemon_battle_data.stats.attack)
        // bytes.writeUint16LE(this.stats.defense, rom.pokemon_battle_data.stats.defense)
        // bytes.writeUint16LE(this.stats.special_attack, rom.pokemon_battle_data.stats.special_attack)
        // bytes.writeUint16LE(this.stats.special_defense, rom.pokemon_battle_data.stats.special_defense)
        // bytes.writeUint16LE(this.stats.speed, rom.pokemon_battle_data.stats.speed)

        bytes.writeUint16LE(this.boosts.attack + 6, rom.pokemon_battle_data.boosts.attack)
        bytes.writeUint16LE(this.boosts.defense + 6, rom.pokemon_battle_data.boosts.defense)
        bytes.writeUint16LE(this.boosts.special_attack + 6, rom.pokemon_battle_data.boosts.special_attack)
        bytes.writeUint16LE(this.boosts.special_defense + 6, rom.pokemon_battle_data.boosts.special_defense)
        bytes.writeUint16LE(this.boosts.speed + 6, rom.pokemon_battle_data.boosts.speed)
        bytes.writeUint16LE(this.boosts.accuracy + 6, rom.pokemon_battle_data.boosts.accuracy)
        bytes.writeUint16LE(this.boosts.evasion + 6, rom.pokemon_battle_data.boosts.evasion)

        // bytes.writeUint8(this.type1, rom.pokemon_battle_data.types)
        // bytes.writeUint8(this.type2, rom.pokemon_battle_data.types + 1)
        // bytes.writeUint8(this.type3, rom.pokemon_battle_data.types + 2)

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
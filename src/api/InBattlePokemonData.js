export class InBattlePokemonData {

    constructor(rom, data) {
        this.dex_number = data.slice(rom.battle_data_addresses.dex_number).readUInt16LE()
        this.battle_slot = data.slice(rom.battle_data_addresses.battle_slot).readUInt8()
        this.form = data.slice(rom.battle_data_addresses.form).readUInt8()
        this.level = data.slice(rom.battle_data_addresses.level).readUInt8()
        this.stats = {
            hp: data.slice(rom.battle_data_addresses.stats.hp).readUInt16LE(),
            attack: data.slice(rom.battle_data_addresses.stats.attack).readUInt16LE(),
            defense: data.slice(rom.battle_data_addresses.stats.defense).readUInt16LE(),
            special_attack: data.slice(rom.battle_data_addresses.stats.special_attack).readUInt16LE(),
            special_defense: data.slice(rom.battle_data_addresses.stats.special_defense).readUInt16LE(),
            speed: data.slice(rom.battle_data_addresses.stats.speed).readUInt16LE(),
        }

        let is_burned = data.slice(rom.battle_data_addresses.status.burned).readUInt8() === 1
        let is_paralized = data.slice(rom.battle_data_addresses.status.paralized).readUInt8() === 1
        let is_sleep = data.slice(rom.battle_data_addresses.status.sleep).readUInt8() === 1
        let is_frozen = data.slice(rom.battle_data_addresses.status.frozen).readUInt8() === 1
        let is_poisoned = data.slice(rom.battle_data_addresses.status.poisoned).readUInt8() === 1

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
            attack: data.slice(rom.battle_data_addresses.boosts.attack).readUInt8() - 6,
            defense: data.slice(rom.battle_data_addresses.boosts.defense).readUInt8() - 6,
            special_attack: data.slice(rom.battle_data_addresses.boosts.special_attack).readUInt8() - 6,
            special_defense: data.slice(rom.battle_data_addresses.boosts.special_defense).readUInt8() - 6,
            speed: data.slice(rom.battle_data_addresses.boosts.speed).readUInt8() - 6,
            accuracy: data.slice(rom.battle_data_addresses.boosts.accuracy).readUInt8() - 6,
            evasion: data.slice(rom.battle_data_addresses.boosts.evasion).readUInt8() - 6
        }

        let type1 = types_by_index[data.slice(rom.battle_data_addresses.types).readUInt8()];
        let type2 = types_by_index[data.slice(rom.battle_data_addresses.types + 1).readUInt8()];
        let type3 = types_by_index[data.slice(rom.battle_data_addresses.types + 2).readUInt8()];

        this.types = [{name: type1}]
        if (type1 !== type2) {
            this.types.push({name: type2})
        }
        if (type3 && type1 !== type3 && type2 !== type3) {
            this.types.push({name: type3})
        }
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
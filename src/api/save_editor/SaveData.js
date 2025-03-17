export class SaveData {
    constructor(name, trainer_data, box_data, team_data, pokemon_data, items_address, badge_address) {
        this.name = name;
        this.trainer_data = trainer_data;
        this.box_data = box_data;
        this.team_data = team_data;
        this.items_address = items_address;
        this.badge_address = badge_address;
        this.pokemon_data = pokemon_data;
    }

    getBoxSlotAddress(box, slot) {
        const box_offset = this.box_data.boxes_address + (this.box_data.slot_length * 30 * box);
        return box_offset + (slot * this.box_data.slot_length)
    }

    getTeamSlotAddress(slot) {
        return this.team_data.party_address + (this.team_data.slot_length * slot);
    }

}

export const XY = new SaveData(
    'XY',
    {
        address: 0x14000,
        length: 368,
        name_address: 0x48,
        name_length: 26
    },
    {
        name_address: 0x1130,
        name_offset: 22,
        boxes_address: 0x22600,
        slot_length: 232,
    },
    {
        party_address: 0x14200,
        slot_length: 260
    },
    {
        dex_number: 0x8,
        form: 0x1D,
        held_item: 0xA,
        ability_num: 0x14,
        nature_num: 0x1C,
        level: 0x74,
        stat_data: {
            curent_hp: 0x78,
            max_hp: 0x7A,
        },
        ev_hp: 0x1E,
        ev_attack: 0x1F,
        ev_defense: 0x20,
        ev_speed: 0x21,
        ev_spatk: 0x22,
        ev_spdef: 0x23,
        ivs: 0x74,
        mote: 64,
        mote_length: 26,
        moves: [
            {
                index: 0x5A,
                pp: 0x62,
            },
            {
                index: 0x5C,
                pp: 0x63,
            },
            {
                index: 0x5E,
                pp: 0x64,
            },
            {
                index: 0x60,
                pp: 0x65,
            }
        ],
    }
)
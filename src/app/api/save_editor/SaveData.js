import {calcBlockChecksum} from "@/app/api/lib/PokemonCrypt";

export class SaveData {
    constructor(name, trainer_data, box_data, team_data, pokemon_data, items_address, badge_address, block_info) {
        this.name = name;
        this.trainer_data = trainer_data;
        this.box_data = box_data;
        this.team_data = team_data;
        this.items_address = items_address;
        this.badge_address = badge_address;
        this.pokemon_data = pokemon_data;
        this.block_info = block_info;
    }

    getBoxSlotAddress(box, slot) {
        const box_offset = this.box_data.boxes_address + (this.box_data.slot_length * 30 * box);
        return box_offset + (slot * this.box_data.slot_length)
    }

    getTeamSlotAddress(slot) {
        return this.team_data.party_address + (this.team_data.slot_length * slot);
    }
}

class BlockInfo {
    constructor(id, address, length) {
        const SIZE_GEN_GAME = 0x65600;
        const TBD_OFFSET = 0x200;

        this.block_offset = SIZE_GEN_GAME - TBD_OFFSET;
        this.id = id;
        this.address = address;
        this.length = length;
    }

    getOffset() {
        return this.block_offset + 0x14 + (this.id * 8) + 6;
    }

    getChecksum(data) {
        return calcBlockChecksum(data.subarray(this.address, this.address + this.length))
    }

    setChecksum(data) {
        const chk = this.getChecksum(data)
        data.writeUint16LE(chk, this.getOffset())
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
        pid: 0x18,
        checksum: 0x6,
        dex_number: 0x8,
        form: 0x1D,
        held_item: 0xA,
        ability_num: 0x14,
        nature_num: 0x1C,
        level: 0xEC,
        stat_data: {
            curent_hp: 0xF0,
            max_hp: 0xF2,
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
    },
    {},
    0xC,
    {
        "puff": new BlockInfo(0, 0x00000, 0x002C8),
        "my_item": new BlockInfo(1, 0x00400, 0x00B88),
        "item_info": new BlockInfo(2, 0x01000, 0x0002C),
        "game_time": new BlockInfo(3, 0x01200, 0x00038),
        "situation": new BlockInfo(4, 0x01400, 0x00150),
        "random_group": new BlockInfo(5, 0x01600, 0x00004),
        "play_time": new BlockInfo(6, 0x01800, 0x00008),
        "fashion": new BlockInfo(7, 0x01A00, 0x001C0),
        "amie_minigame_records": new BlockInfo(8, 0x01C00, 0x000BE),
        "temp_variables": new BlockInfo(9, 0x01E00, 0x00024),
        "field_move_model_save": new BlockInfo(10, 0x02000, 0x02100),
        "misc": new BlockInfo(11, 0x04200, 0x00140),
        "box": new BlockInfo(12, 0x04400, 0x00440),
        "battle_box": new BlockInfo(13, 0x04A00, 0x00574),
        "pss1": new BlockInfo(14, 0x05000, 0x04E28),
        "pss2": new BlockInfo(15, 0x0A000, 0x04E28),
        "pss3": new BlockInfo(16, 0x0F000, 0x04E28),
        "my_status": new BlockInfo(17, 0x14000, 0x00170),
        "poke_party_save": new BlockInfo(18, 0x14200, 0x0061C),
        "event_work": new BlockInfo(19, 0x14A00, 0x00504),
        "zukan_data": new BlockInfo(20, 0x15000, 0x006A0),
        "hologram_clips": new BlockInfo(21, 0x15800, 0x00644),
        "union_pokemon": new BlockInfo(22, 0x16000, 0x00104),
        "config_save": new BlockInfo(23, 0x16200, 0x00004),
        "amie_decoration_stuff": new BlockInfo(24, 0x16400, 0x00420),
        "opower": new BlockInfo(25, 0x16A00, 0x00064),
        "strength_rock_position": new BlockInfo(26, 0x16C00, 0x003F0),
        "trainer_pr_video": new BlockInfo(27, 0x17000, 0x0070C),
        "gts_data": new BlockInfo(28, 0x17800, 0x00180),
        "packed_menu_bits": new BlockInfo(29, 0x17A00, 0x00004),
        "pss_profile_qa": new BlockInfo(30, 0x17C00, 0x0000C),
        "repel_info": new BlockInfo(31, 0x17E00, 0x00048),
        "boss_data_fetch_history": new BlockInfo(32, 0x18000, 0x00054),
        "streetpass_history": new BlockInfo(33, 0x18200, 0x00644),
        "live_match_data": new BlockInfo(34, 0x18A00, 0x005C8),
        "mac_address_logging": new BlockInfo(35, 0x19000, 0x002F8),
        "dendou": new BlockInfo(36, 0x19400, 0x01B40),
        "battle_house": new BlockInfo(37, 0x1B000, 0x001F4),
        "sodateya": new BlockInfo(38, 0x1B200, 0x001F0),
        "trial_house": new BlockInfo(39, 0x1B400, 0x00216),
        "berry_field": new BlockInfo(40, 0x1B800, 0x00390),
        "mystery_gift_save": new BlockInfo(41, 0x1BC00, 0x01A90),
        "sub_event_log": new BlockInfo(42, 0x1D800, 0x00308),
        "poke_diary_save": new BlockInfo(43, 0x1DC00, 0x00618),
        "record": new BlockInfo(44, 0x1E400, 0x0025C),
        "friend_safari": new BlockInfo(45, 0x1E800, 0x00834),
        "super_train": new BlockInfo(46, 0x1F200, 0x00318),
        "unused": new BlockInfo(47, 0x1F600, 0x007D0),
        "link_info": new BlockInfo(48, 0x1FE00, 0x00C48),
        "pss_usage_info": new BlockInfo(49, 0x20C00, 0x00078),
        "game_sync_save": new BlockInfo(50, 0x20E00, 0x00200),
        "pss_icon": new BlockInfo(51, 0x21000, 0x00C84),
        "validation_save": new BlockInfo(52, 0x21E00, 0x00628),
        "BOX": new BlockInfo(53, 0x22600, 0x34AD0),
        "jpeg": new BlockInfo(54, 0x57200, 0x0E058),
    }
)
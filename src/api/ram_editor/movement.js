/* eslint-disable no-undef */
// noinspection JSUnresolvedVariable

import {COVERAGE_DATA} from '@/data/type_data';
import {MOVE_DATA} from '@/data/move_data';
import {FORCE_TYPE_ABILITIES, SPECIAL_MOVES} from '@/data/force_type_data';

function Movement(item_held, ability, slot, move_id, pp, move_byte_data) {
    if (move_id === 0) return;

    let move_current_pp = move_byte_data.slice(14 * slot).readUInt8();

    let move = MOVE_DATA[move_id];
    if (!move) {
        return {
            discovered: false,
            slot: slot,
            move_name: '',
            description: '',
            current_pp: 0,
            max_pp: 0,
            type: '',
            power: 0,
            accuracy: 0,
            category: '',
            coverage_data: {
                double_damage_to: [],
                half_damage_to: [],
                no_damage_to: []
            }
        };
    }

    let move_type = move.typename;

    if (move_id in SPECIAL_MOVES) {
        let special_move = SPECIAL_MOVES[move_id];
        if (item_held in special_move) {
            move_type = special_move[item_held];
        }
    }

    let forced_type = ability.toString() in FORCE_TYPE_ABILITIES;
    if (forced_type) {
        let ability_data = FORCE_TYPE_ABILITIES[ability];
        if (move_type === ability_data.forced_from) {
            move_type = ability_data.forced_type;
        } else if (ability_data.forced_from === '*') {
            move_type = ability_data.forced_type;
        }
    }


    let coverage_data = COVERAGE_DATA[move_type.toLowerCase()];
    return {
        discovered: move_current_pp < move.movepp,
        slot: slot,
        current_pp: move_current_pp,
        move_name: move.movename,
        max_pp: move.movepp,
        type: move_type,
        power: move.movepower,
        accuracy: move.moveaccuracy,
        category: move.movecategoryname,
        flavor_text: move.falvor_text,
        coverage_data: coverage_data
    };

}

export {
    Movement
}
/* eslint-disable no-undef */
// noinspection JSUnresolvedVariable

import {readFileSync} from 'fs'
import path from "path";

let FORCE_TYPE_ABILITIES = {
    182: {
        name: 'Pixilate',
        forced_from: 'Normal',
        forced_type: 'Fairy'
    },
    96: {
        name: 'Normalize',
        forced_from: '*',
        forced_type: 'Normal'
    },
    184: {
        name: 'Aerilate',
        forced_from: 'Normal',
        forced_type: 'Flying'
    },
    206: {
        name: 'Galvanize',
        forced_from: 'Normal',
        forced_type: 'Electric'
    },
    174: {
        name: 'Refrigerate',
        forced_from: 'Normal',
        forced_type: 'Ice'
    }
}

function Movement(item_held, ability, slot, move_id, pp, move_byte_data) {
    if (move_id === 0) return;

    let move_current_pp = move_byte_data.slice(14 * slot).readUInt8();

    let move_data_file = readFileSync(path.join(__static, 'data', 'move_data.json'));
    let type_data_file = readFileSync(path.join(__static, 'data', 'type_data.json'));
    let special_move_data_file = readFileSync(path.join(__static, 'data', 'special_move_data.json'));

    let move_data = JSON.parse(move_data_file);
    let type_data = JSON.parse(type_data_file);
    let special_move_data = JSON.parse(special_move_data_file);

    let move = move_data[move_id];
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
    let forced_type = ability.toString() in FORCE_TYPE_ABILITIES;

    if (move_id in special_move_data) {
        let special_move = special_move_data[move_id];
        if (item_held in special_move) {
            move_type = special_move[item_held];
        }
    }

    if (forced_type) {
        let ability_data = FORCE_TYPE_ABILITIES[ability];
        if (move_type === ability_data.forced_from) {
            move_type = ability_data.forced_type;
        } else if (ability_data.forced_from === '*') {
            move_type = ability_data.forced_type;
        }
    }


    let coverage_data = type_data[move_type.toLowerCase()];
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
import {readFileSync} from 'fs'
import path from "path";
import struct from "python-struct";

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
function Movement(ability, slot, id, pp, move_byte_data) {
    if (id === 0) return;

    let move_current_pp = struct.unpack('B', move_byte_data.slice(14 * slot))[0];
    // eslint-disable-next-line no-undef
    let move_file = path.join(__static, 'data', 'move_data.json');
    // eslint-disable-next-line no-undef
    let type_file = path.join(__static, 'data', 'type_data.json');
    // eslint-disable-next-line no-unused-vars
    let move_data = readFileSync(move_file);
    let type_data = readFileSync(type_file);
    let res = JSON.parse(move_data)
    let type_res = JSON.parse(type_data)
    let json_res = res[id];
    if (json_res === undefined) {
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
            coverage: {}
        };
    }

    let move_type = json_res.typename;
    let forced_type = ability.toString() in FORCE_TYPE_ABILITIES;

    if (forced_type) {
        let ability_data = FORCE_TYPE_ABILITIES[ability];
        if (move_type === ability_data.forced_from) {
            move_type = ability_data.forced_type;
        } else if (ability_data.forced_from === '*') {
            move_type = ability_data.forced_type;
        }
    }


    let coverage_data = type_res[move_type.toLowerCase()];
    return {
        discovered: move_current_pp < json_res.movepp,
        slot: slot,
        current_pp: move_current_pp,
        move_name: json_res.movename,
        max_pp: json_res.movepp,
        type: move_type,
        power: json_res.movepower,
        accuracy: json_res.moveaccuracy,
        category: json_res.movecategoryname,
        flavor_text: json_res.falvor_text,
        coverage: coverage_data
    };

}

export {
    Movement
}
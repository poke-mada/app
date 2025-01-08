import {readFileSync} from 'fs'
import path from "path";
import struct from "python-struct";

function Movement(slot, id, pp, move_byte_data) {
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
    let coverage_data = type_res[json_res.typename.toLowerCase()];
    return {
        discovered: move_current_pp < json_res.movepp,
        slot: slot,
        current_pp: move_current_pp,
        move_name: json_res.movename,
        max_pp: json_res.movepp,
        type: json_res.typename,
        power: json_res.movepower,
        accuracy: json_res.moveaccuracy,
        category: json_res.movecategoryname,
        coverage: coverage_data
    };

}

export {
    Movement
}
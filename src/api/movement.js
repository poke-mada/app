import {readFileSync} from 'fs'

function Movement(slot, id, pp) {
    if (id === 0) return;

    // eslint-disable-next-line no-unused-vars
    let data = readFileSync('./public/data/move_data.json');
    let res = JSON.parse(data)
    let json_res = res[id];
    return {
        slot: slot,
        current_pp: pp,
        move_name: json_res.movename,
        max_pp: json_res.movepp,
        type: json_res.typename,
        power: json_res.movepower,
        accuracy: json_res.moveaccuracy,
        category: json_res.movecategoryname,
    };

}

export {
    Movement
}
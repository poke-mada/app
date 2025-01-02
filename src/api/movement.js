function Movement(slot, socket, database, pokemon, id, pp) {
    if (id === 0) return;

    let stmt = database.prepare('select mv.movename, gm.generationmoveid, movepp, typename, movepower, moveaccuracy, movecontactflag, movecategoryname from "pokemon.generationmove" gm left join "pokemon.move" mv on gm.moveid = mv.moveid left join "pokemon.movelookup" ml on mv.movename = ml.movename left join "pokemon.type" ty on gm.typeid = ty.typeid left join "pokemon.movecategory" mc on gm.movecategoryid = mc.movecategoryid where ml.moveindex = ? and gm.generationid = 6');
    // eslint-disable-next-line no-unused-vars
    stmt.get(id, (err, res, s) => {
        if (res === undefined) {
            console.error('failed for move: ', id);
            return;
        }
        let data = {
            pokemon_slot: pokemon.slot,
            pokemon_team: pokemon.team,
            slot: slot,
            current_pp: pp,
            move_name: res.movename,
            max_pp: res.movepp,
            type: res.typename,
            power: res.movepower,
            accuracy: res.moveaccuracy,
            category: res.movecategoryname,
        };

        socket.send('move_update', data);

    })
}

export {
    Movement
}
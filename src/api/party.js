'use strict';

import {Pokemon} from "./pokemon.js";

let BLOCK_SIZE = 56
let SLOT_OFFSET = 484
let SLOT_DATA_SIZE = (8 + (4 * BLOCK_SIZE))
let STAT_DATA_OFFSET = 112
let STAT_DATA_SIZE = 22

function omitKeys(obj, keys)
{
    var dup = {};
    for (var key in obj) {
        if (keys.indexOf(key) == -1) {
            dup[key] = obj[key];
        }
    }
    return dup;
}

class Party {
    constructor(citra, game_address) {
        //0x8CE1CE8 ally
        //142625392 enemy
        this.citra = citra;
        this.address = game_address;
        this.team = [];
    }

    async loadTeam(oldTeam, internalSocket) {
        for (let slot = 0; slot < 6; slot++) {
            let read_address = this.address + (slot * SLOT_OFFSET)
            let pokemonData = await this.citra.readMemory(read_address, SLOT_DATA_SIZE);
            let statsData = await this.citra.readMemory(read_address + SLOT_DATA_SIZE + STAT_DATA_OFFSET, STAT_DATA_SIZE);

            if (pokemonData && statsData) {
                let data = Buffer.concat([pokemonData, statsData])
                let pokemon = new Pokemon(internalSocket, data, 'you', slot)
                if (pokemon.dex_number !== 0) {
                    let pokemonDated = omitKeys(pokemon, ['socket']);
                    if (JSON.stringify(oldTeam[slot]) === JSON.stringify(pokemonDated)) return;
                    internalSocket.send('party_update', {
                        slot: slot,
                        team: 'you',
                        pokemon: pokemonDated
                    })
                    oldTeam[slot] = pokemonDated
                } else {
                    internalSocket.send('party_update', {
                        slot: slot,
                        team: 'you',
                        pokemon: null
                    })
                }
            }
        }

    }

}

export {
    Party
}
'use strict';

import {Pokemon} from "./pokemon.js";

let BLOCK_SIZE = 56
let SLOT_OFFSET = 484
let SLOT_DATA_SIZE = (8 + (4 * BLOCK_SIZE))
let STAT_DATA_OFFSET = 112
let STAT_DATA_SIZE = 22

class Party {
    constructor(citra, game_address, team) {
        this.team = team;
        //0x8CE1CE8 ally
        //142625392 enemy
        this.citra = citra;
        this.address = game_address;
    }

    async pokemonHandler(oldTeam, ipc, slot) {
        let read_address = this.address + (slot * SLOT_OFFSET)
        let pokemonData = await this.citra.readMemory(read_address, SLOT_DATA_SIZE);
        let statsData = await this.citra.readMemory(read_address + SLOT_DATA_SIZE + STAT_DATA_OFFSET, STAT_DATA_SIZE);

        if (pokemonData && statsData) {
            let data = Buffer.concat([pokemonData, statsData]);
            try {
                let pokemon = new Pokemon(data);
                if (pokemon.dex_number !== 0) {
                    if (JSON.stringify(oldTeam[slot]) === JSON.stringify(pokemon)) return;
                    ipc.reply('party_update', {
                        slot: slot,
                        team: this.team,
                        pokemon: pokemon
                    })
                    oldTeam[slot] = pokemon;
                } else {
                    ipc.reply('party_update', {
                        slot: slot,
                        team: this.team,
                        pokemon: null
                    })
                }
                // eslint-disable-next-line no-empty
            } catch (e) {
            }
        }
    }

    loadTeam(oldTeam, ipc) {
        for (let slot = 0; slot < 6; slot++) {
            setInterval(async () => {
                await this.pokemonHandler(oldTeam, ipc, slot)
            }, 500)
        }
    }

}

export {
    Party
}
'use strict';

import {Pokemon} from "./pokemon.js";
import {CitraClient} from "@/api/CitraClient";
import {decryptData} from "@/api/CitraReader";
import struct from "python-struct";

let BLOCK_SIZE = 56
let SLOT_OFFSET = 484
let SLOT_DATA_SIZE = (8 + (4 * BLOCK_SIZE))
let STAT_DATA_OFFSET = 112
let STAT_DATA_SIZE = 22

class Party {

    constructor(game, team) {
        this.team = team;   
        //0x8CE1CE8 ally
        //142625392 enemy
        this.game = game;

        this.pokemonTeam = {
        }

        this.discoveredPokemons = {
        }

    }

    pokemonHandler(ipc, slot) {
        // eslint-disable-next-line no-constant-condition
        setInterval(async () => {
            let citra = new CitraClient();
            try {
                let read_address
                let wildData = await citra.readMemory(this.game.battleWildPartyAddress, SLOT_DATA_SIZE);
                let rawWildData = decryptData(wildData);
                let trainerData = await citra.readMemory(this.game.battleTrainerPartyAddress, SLOT_DATA_SIZE);
                let rawTrainerData = decryptData(trainerData);
                let wildPP = (await citra.readMemory(this.game.wildppadd, 1)).readUInt8(0);
                let trainerPP = (await citra.readMemory(this.game.trainerppadd, 1)).readUInt8(0);
                let wildDex = struct.unpack("<H", rawWildData.subarray(8, 10))[0]
                let trainerDex = struct.unpack("<H", rawTrainerData.subarray(8, 10))[0]

                if (this.team === 'you') {
                    if (wildDex >= 1 && wildDex < 808 && wildPP < 65) {
                        read_address = this.game.battleWildPartyAddress
                    } else if (trainerDex >= 1 && trainerDex < 808 && trainerPP < 65) {
                        read_address = this.game.battleTrainerPartyAddress
                    } else {
                        read_address = this.game.partyAddress
                    }
                } else {
                    if (wildDex >= 1 && wildDex < 808 && trainerPP < 65) {
                        read_address = this.game.wildOpponentPartyAddress
                    } else if (trainerDex >= 1 && trainerDex < 808 && trainerPP < 65) {
                        read_address = this.game.trainerOpponentPartyAddress
                    } else {
                        return;
                    }
                }

                let slot_address = read_address + (slot * SLOT_OFFSET)
                let pokemonData = await citra.readMemory(slot_address, SLOT_DATA_SIZE);
                let statsData = await citra.readMemory(slot_address + SLOT_DATA_SIZE + STAT_DATA_OFFSET, STAT_DATA_SIZE);
                if (pokemonData && statsData) {
                    let data = Buffer.concat([pokemonData, statsData]);
                    let pokemon = new Pokemon(data);
                    if (pokemon.dex_number >= 1 && pokemon.dex_number < 808) {
                        if (JSON.stringify(this.pokemonTeam[slot]) === JSON.stringify(pokemon)) return;
                        if (this.team === 'you') {
                            ipc.reply('party_update', {
                                slot: slot,
                                team: 'you',
                                pokemon: pokemon
                            })
                            this.discoveredPokemons[slot] = pokemon;
                        }
                        this.pokemonTeam[slot] = pokemon;
                    }
                }
                // eslint-disable-next-line no-empty
            } catch (e) {
            } finally {
                citra.socket.close()
            }
        }, 500)
    }

    loadTeam(ipc) {
        this.pokemonHandler(ipc, 0)
        this.pokemonHandler(ipc, 1)
        this.pokemonHandler(ipc, 2)
        this.pokemonHandler(ipc, 3)
        this.pokemonHandler(ipc, 4)
        this.pokemonHandler(ipc, 5)
        if (this.team === 'enemy') {
            this.equipedPokemonHandler(ipc)
        }
    }

    equipedPokemonHandler(ipc) {
        // eslint-disable-next-line no-constant-condition
        setInterval(async () => {
            let citra = new CitraClient();
            try {
                let wildData = await citra.readMemory(this.game.battleWildPartyAddress, SLOT_DATA_SIZE);
                let rawWildData = decryptData(wildData);
                let trainerData = await citra.readMemory(this.game.battleTrainerPartyAddress, SLOT_DATA_SIZE);
                let wildPP = (await citra.readMemory(this.game.wildppadd, 1)).readUint8(0);
                let trainerPP = (await citra.readMemory(this.game.trainerppadd, 1)).readUint8(0);
                let rawTrainerData = decryptData(trainerData);
                let wildDex = struct.unpack("<H", rawWildData.subarray(8, 10))[0]
                let trainerDex = struct.unpack("<H", rawTrainerData.subarray(8, 10))[0]
                let dex_number_address = 0;

                if (wildDex >= 1 && wildDex < 808 && wildPP < 65) {
                    dex_number_address = this.game.currentOpponentAddress
                } else if (trainerDex >= 1 && trainerDex < 808 && trainerPP < 65) {
                    dex_number_address = this.game.currentOpponentAddress
                } else if (Object.keys(this.discoveredPokemons).length > 0 || Object.keys(this.pokemonTeam).length > 0){
                    this.discoveredPokemons = {}
                    this.pokemonTeam = {}
                    ipc.reply('end_combat')
                    return;
                }

                let dex_number = (await citra.readMemory(dex_number_address, 2)).readUInt16LE()
                if (dex_number >= 1 && dex_number < 808) {
                    for (let slot of Object.keys(this.pokemonTeam)) {
                        let pokemon = this.pokemonTeam[slot]
                        if (dex_number === pokemon.dex_number) {
                            if (slot && slot in this.discoveredPokemons) {
                                break;
                            }
                            ipc.reply('selected_enemy', {
                                pokemon: pokemon
                            })
                            ipc.reply('party_update', {
                                slot: slot,
                                team: 'enemy',
                                pokemon: pokemon
                            })
                            this.discoveredPokemons[slot] = pokemon;
                        }
                    }
                }
                // eslint-disable-next-line no-empty
            } catch (e) {
                console.error(e)
            } finally {
                citra.socket.close()
            }
        }, 500)
    }
}

export {
    Party
}
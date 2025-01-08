/* eslint-disable no-empty */
'use strict';

import {Pokemon} from "./pokemon.js";
import {CitraClient} from "@/api/CitraClient";
import {decryptData} from "@/api/CitraReader";
import struct from "python-struct";
import {clientSend} from "@/web-api/WebApi";
import logging from "@/api/logging";

let BLOCK_SIZE = 56
let SLOT_OFFSET = 484
let SLOT_DATA_SIZE = (8 + (4 * BLOCK_SIZE))
let STAT_DATA_OFFSET = 112
let STAT_DATA_SIZE = 22

class Party {

    constructor(game, team) {
        this.team = team;
        this.game = game;
        this.pokemonTeam = {}
        this.discoveredPokemons = {}

    }

    pokemonHandler(client, ipc, slot, othersParty) {
        // eslint-disable-next-line no-constant-condition
        setTimeout(async () => {
            let citra = new CitraClient();
            try {
                // eslint-disable-next-line no-constant-condition
                while (true) {
                    let read_address
                    let wildData = await citra.readMemory(this.game.battleWildPartyAddress, SLOT_DATA_SIZE);
                    let rawWildData = decryptData(wildData);

                    let trainerData = await citra.readMemory(this.game.battleTrainerPartyAddress, SLOT_DATA_SIZE);
                    let rawTrainerData = decryptData(trainerData);

                    let wildPP = (await citra.readMemory(this.game.wildppadd, 1)).readUInt8(0);
                    let trainerPP = (await citra.readMemory(this.game.trainerppadd, 1)).readUInt8(0);

                    let wildDex = struct.unpack("<H", rawWildData.subarray(8, 10))[0]
                    let trainerDex = struct.unpack("<H", rawTrainerData.subarray(8, 10))[0]
                    let pp_address;
                    if (this.team === 'you') {
                        if (wildDex >= 1 && wildDex < 808 && wildPP < 65) {
                            read_address = this.game.battleWildPartyAddress
                            pp_address = this.game.wildppadd
                            logging.logger.info("wild battle")
                        } else if (trainerDex >= 1 && trainerDex < 808 && trainerPP < 65) {
                            read_address = this.game.battleTrainerPartyAddress
                            pp_address = this.game.trainerppadd
                            logging.logger.info("trainer battle")
                        } else {
                            read_address = this.game.partyAddress
                            pp_address = this.game.wildppadd
                            logging.logger.info("off battle")
                        }
                    } else {
                        if (wildDex >= 1 && wildDex < 808 && wildPP < 65) {
                            read_address = this.game.wildOpponentPartyAddress
                            pp_address = this.game.wildppadd
                        } else if (trainerDex >= 1 && trainerDex < 808 && trainerPP < 65) {
                            read_address = this.game.trainerOpponentPartyAddress
                            pp_address = this.game.trainerppadd
                        } else {
                            continue;
                        }
                    }

                    let slot_address = read_address + (slot * SLOT_OFFSET)
                    let pokemonData = await citra.readMemory(slot_address, SLOT_DATA_SIZE);
                    let statsData = await citra.readMemory(slot_address + SLOT_DATA_SIZE + STAT_DATA_OFFSET, STAT_DATA_SIZE);
                    if (pokemonData && statsData) {
                        let data = Buffer.concat([pokemonData, statsData]);
                        let move_data;
                        if (this.team === 'enemy') {
                            let allyParty = othersParty.pokemonTeam;
                            console.log(Object.keys(allyParty).length)
                            move_data = await citra.readMemory(pp_address + (this.game.mongap * (slot + Object.keys(allyParty).length)), 56)
                        } else {
                            move_data = await citra.readMemory(pp_address + (this.game.mongap * (slot + 6)), 56)
                        }
                        let pokemon = new Pokemon(move_data, data);
                        if (JSON.stringify(this.pokemonTeam[slot]) === JSON.stringify(pokemon)) continue;
                        if (this.team === 'you') {
                            if (pokemon.dex_number >= 1 && pokemon.dex_number < 808) {
                                ipc.reply('party_update', {
                                    slot: slot,
                                    team: 'you',
                                    pokemon: pokemon
                                })
                            } else {
                                ipc.reply('party_update', {
                                    slot: slot,
                                    team: 'you',
                                    pokemon: null
                                })
                            }
                            try {
                                clientSend(client, {
                                    slot: slot,
                                    pokemon: pokemon
                                })
                            } catch (e) {
                            }
                            this.discoveredPokemons[slot] = pokemon;
                            this.pokemonTeam[slot] = pokemon;
                        }
                    }
                    // eslint-disable-next-line no-empty
                }
            } catch (e) {
                console.log('some error', e)
            } finally {
                citra.socket.close()
            }
        }, 1)
    }

    loadTeam(client, ipc, other_party) {
        this.pokemonHandler(client, ipc, 0, other_party)
        this.pokemonHandler(client, ipc, 1, other_party)
        this.pokemonHandler(client, ipc, 2, other_party)
        this.pokemonHandler(client, ipc, 3, other_party)
        this.pokemonHandler(client, ipc, 4, other_party)
        this.pokemonHandler(client, ipc, 5, other_party)
        if (this.team === 'enemy') {
            this.equipedPokemonHandler(ipc)
        }
    }

    equipedPokemonHandler(ipc) {
        // eslint-disable-next-line no-constant-condition
        setTimeout(async () => {
            let citra = new CitraClient();
            try {
                // eslint-disable-next-line no-constant-condition
                while (true) {
                    let wildData = await citra.readMemory(this.game.battleWildPartyAddress, SLOT_DATA_SIZE);
                    let rawWildData = decryptData(wildData);
                    let wildPP = (await citra.readMemory(this.game.wildppadd, 1)).readUint8(0);
                    let wildDex = struct.unpack("<H", rawWildData.subarray(8, 10))[0]

                    let trainerData = await citra.readMemory(this.game.battleTrainerPartyAddress, SLOT_DATA_SIZE);
                    let rawTrainerData = decryptData(trainerData);
                    let trainerPP = (await citra.readMemory(this.game.trainerppadd, 1)).readUint8(0);
                    let trainerDex = struct.unpack("<H", rawTrainerData.subarray(8, 10))[0]

                    let dex_number_address = 0;

                    if (wildDex >= 1 && wildDex < 808 && wildPP < 65) {
                        dex_number_address = this.game.currentOpponentAddress
                    } else if (trainerDex >= 1 && trainerDex < 808 && trainerPP < 65) {
                        dex_number_address = this.game.currentOpponentAddress
                    } else if (Object.keys(this.discoveredPokemons).length > 0 || Object.keys(this.pokemonTeam).length > 0) {
                        this.discoveredPokemons = {}
                        this.pokemonTeam = {}
                        ipc.reply('end_combat')
                        continue;
                    }

                    let dex_number = (await citra.readMemory(dex_number_address, 2)).readUInt16LE()
                    if (dex_number >= 1 && dex_number < 808) {
                        for (let slot of Object.keys(this.pokemonTeam)) {
                            let pokemon = this.pokemonTeam[slot]
                            if (dex_number === pokemon.dex_number) {
                                if (slot && slot in this.discoveredPokemons) {
                                    if (JSON.stringify(this.discoveredPokemons[slot]) === JSON.stringify(pokemon)) {
                                        break;
                                    }
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
                }
            } catch (e) {
                console.log(e)
            } finally {
                citra.socket.close()
            }
        }, 1)
    }

    close() {
    }
}

export {
    Party
}
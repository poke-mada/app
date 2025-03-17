import {RAM_ROM2 as rom} from "@/stores/back_constants";

function extractLegible(text) {
    // Regex que busca caracteres legibles en español y símbolos QWERTY
    const patron = /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9\s.,;:¡!¿?\-_\(\)\[\]\{\}"'@#\$%&*/=<>|\\^~]+/g;
    // Unir todas las coincidencias encontradas
    const partesLegibles = text.match(patron);
    return partesLegibles ? partesLegibles.join('') : '';
}

export function truncateBuffer(buffer) {
    const sequence = Buffer.from([0x00, 0x00, 0x00]);
    const index = buffer.indexOf(sequence);

    if (index !== -1) {
        return buffer.slice(0, index + 1); // Retorna solo la parte antes del "00 00"
    }

    return buffer; // Si no se encuentra, retorna el buffer completo
}

export class RomData {
    constructor({
                    item_data,
                    player_team_data,
                    pokemon_battle_data,
                    pokemon_data,
                    box_data,
                    wild_battle_data,
                    trainer_battle_data,
                    multi_battle_data
                }) {
        this.item_data = item_data;

        this.wild_battle_data = wild_battle_data;
        this.player_team_data = player_team_data;
        this.pokemon_data = pokemon_data;
        this.pokemon_battle_data = pokemon_battle_data;
        this.box_data = box_data;
        this.trainer_battle_data = trainer_battle_data;
        this.multi_battle_data = multi_battle_data;
    }


    getBattleData(combat_env) {
        try {
            let section = `${combat_env.toLowerCase()}_battle_data`;
            return this[section];
        } catch (e) {
            return {};
        }
    }

    getBattleDataAddress(combat_env) {
        try {
            const env_data = this.getBattleData(combat_env);
            return env_data.combat_data.address;
        } catch (e) {
            return -1;
        }
    }

    _getBoxSlotAddress(box, slot) {
        const pokemon_per_slot = 30;
        const box_offset = this.box_data.boxes_address + (this.box_data.slot_length * pokemon_per_slot * box);
        return box_offset + (slot * this.box_data.slot_length)
    }

    getTeamSlotAddress(slot) {
        return this.player_team_data.address + (this.player_team_data.slot_length * slot);
    }

    getCombatFrontalMon(slot) {
        const firstMonAddress = this.wild_battle_data.combat_data.selected_mons - this.wild_battle_data.combat_data.multi_mon_gap;
        return firstMonAddress + (this.wild_battle_data.combat_data.multi_mon_gap * slot)
    }

    async readFrontalPokemonData(citra, slot) {
        let pokemon_address = rom.getCombatFrontalMon(slot);
        return await citra.readMemory(pokemon_address, rom.wild_battle_data.combat_data.slot_data_size)
    }

    async readMessageBox(citra, address, messageLenght = 152) {
        const messageBytes = await citra.readMemory(address, messageLenght);
        return extractLegible(truncateBuffer(messageBytes).toString('utf16le').replace('\n', ' '))
    }

    async readMote(citra, address, messageLenght = 152) {
        const messageBytes = await citra.readMemory(address, messageLenght);
        return truncateBuffer(messageBytes).toString('utf16le')
    }
}
let a = 147725544 - 147726028;
// if game=="X/Y":
// itmdl=[147236508,9952,10208,10640,11016,12616,0x67E852C]   #70F62C #67E892C xy trainers
// elif game=="OmegaRuby/AlphaSapphire":
// itmdl=[147250640,9952,10208,10640,11024,12624] #reverse-berries,meds,tms,keys,items
export const XY = Object.freeze(new RomData(
    {
        item_data: {
            badges: 0x8C6A6A0,
            items: 0x8C6A69C,
            berries_offset: 9952,
            meds_offset: 10208,
            tms_offset: 10640,
            unknwon: 11016,
            keys_offset: 12616,
        },
        player_team_data: {
            pp_address: 0x820430C,
            address: 147725544,
            slot_offset: 484,
            slot_data_size: 232,
            stat_data_size: 22
        },
        pokemon_data: {},
        pokemon_battle_data: {
            dex_number: 0x4,
            battle_slot: 0x11,
            level: 0x10,
            form: 0x14B,
            gender: 0xFB,
            status: {
                burned: 0x24,
                paralized: 0x18,
                sleep: 0x1C,
                frozen: 0x20,
                poisoned: 0x28,
            },
            stats: {
                max_hp: 0x6,
                attack: 0xEE,
                defense: 0xF0,
                special_attack: 0xF2,
                special_defense: 0xF4,
                speed: 0xF6,
            },
            boosts: {
                attack: 0xFC,
                defense: 0xFD,
                special_attack: 0xFE,
                special_defense: 0xFF,
                speed: 0x100,
                accuracy: 0x101,
                evasion: 0x102,
            },
            types: 0xF8
        },
        box_data: {},
        wild_battle_data: {
            your_team: {
                address: 0x8804A70,
                battle_data_slots: [0, 1, 2, 3, 4, 5],
                slot_offset: 484,
                slot_data_size: 232,
                stat_data_size: 22
            },
            enemy_team: {
                address: 0x8803ECC,
                battle_data_slots: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
                slot_offset: 484,
                slot_data_size: 232,
                stat_data_size: 22
            },
            ally_team: {
                address: 0,
                battle_data_slots: [6, 7, 8, 9, 10, 11],
                slot_offset: 484,
                slot_data_size: 232,
                stat_data_size: 22
            },
            combat_data: {
                address: 0x8203ED0,
                pp_address: 0x820430C,
                multi_mon_gap: 235568,
                mon_gap: 580,
                combat_log: 0x8523114,
                trainer_log: 0x8523C94,
                move_log: 0x845C004,
                selected_mons: 0x84208C8,
                slot_data_size: 332,
            }
        },
        trainer_battle_data: {
            your_team: {
                address: 0x8803F28,
                battle_data_slots: [0, 1, 2, 3, 4, 5],
                slot_offset: 484,
                slot_data_size: 232,
                stat_data_size: 22
            },
            enemy_team: {
                address: 0x8804ACC,
                battle_data_slots: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
                slot_offset: 484,
                slot_data_size: 232,
                stat_data_size: 22
            },
            ally_team: {
                address: 0,
                battle_data_slots: [6, 7, 8, 9, 10, 11],
                slot_offset: 484,
                slot_data_size: 232,
                stat_data_size: 22
            },
            combat_data: {
                address: 0x82059E0,
                pp_address: 0x8205E1C,
                multi_mon_gap: 235568,
                mon_gap: 580,
                combat_log: 0x8523114,
                trainer_log: 0x8523C94,
                move_log: 0x845C004,
                selected_mons: 0x84208C8,
                slot_data_size: 332,
            }
        },
        multi_battle_data: {
            your_team: {
                address: 0x8803F28,
                battle_data_slots: [0, 1, 2, 3, 4, 5],
                slot_offset: 484,
                slot_data_size: 232,
                stat_data_size: 22
            },
            enemy_team: {
                address: 0x8804ACC,
                battle_data_slots: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
                slot_offset: 484,
                slot_data_size: 232,
                stat_data_size: 22
            },
            ally_team: {
                address: 0,
                battle_data_slots: [6, 7, 8, 9, 10, 11],
                slot_offset: 484,
                slot_data_size: 232,
                stat_data_size: 22
            },
            combat_data: {
                address: 0x8209D98,
                pp_address: 0x8205E1C,
                multi_mon_gap: 235568,
                mon_gap: 580,
                combat_log: 0,
                trainer_log: 0,
                move_log: 0x84CF064,
                selected_mons: 0x84208C8,
                slot_data_size: 332,
            }
        }
    }
));

export async function getGame() {
    return XY;
}
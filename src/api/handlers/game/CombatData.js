import {CombatEnv, CombatType} from "@/api/ram_editor/RamAccesor";

import {RAM_ROM2 as rom} from '@/stores/back_constants'
import {decryptPokemonData} from "@/api/lib/PokemonCrypt";
import {validateBattleData, validatePokemon} from "@/api/lib/validators";
import {InBattlePokemonData} from "@/api/ram_editor";
import {logger} from "@/api/handlers/logging";

let your_battle_data = {};
let ally_npc_battle_data = {};
let enemy_battle_data = {};

let combat_move_log_messages = [];
let combat_log_messages = [];
let trainer_log_messages = [];
let nextPokemon = null;
let hasChanged = false;
let hasAlly = false;

function replacer(key, value) {
    if (key === 'original_data') {
        return undefined;
    }

    return value;
}

async function isInCombat(citra) {
    let wildData = await citra.readMemory(rom.wild_battle_data.your_team.address, rom.wild_battle_data.combat_data.slot_data_size);
    let rawWildData = decryptPokemonData(wildData);

    let wildPP = (await citra.readMemory(rom.wild_battle_data.combat_data.pp_address, 1)).readUInt8(0);
    let wildDex = rawWildData.subarray(8).readUInt16LE()

    if (validatePokemon(wildDex) && wildPP < 65) {
        return CombatEnv.WILD;
    }

    let trainerData = await citra.readMemory(rom.trainer_battle_data.your_team.address, rom.trainer_battle_data.combat_data.slot_data_size);
    let rawTrainerData = decryptPokemonData(trainerData);

    let trainerPP = (await citra.readMemory(rom.trainer_battle_data.combat_data.pp_address, 1)).readUInt8(0);
    let trainerDex = rawTrainerData.subarray(8).readUInt16LE()

    if (validatePokemon(trainerDex) && trainerPP < 65) {
        return CombatEnv.TRAINER;
    }

    return CombatEnv.OFF;
}

async function getCombatType(citra, combatEnv) {
    let first_data = await rom.readFrontalPokemonData(citra, 0);
    let second_data = await rom.readFrontalPokemonData(citra, 1);
    let third_data = await rom.readFrontalPokemonData(citra, 2);
    let fourth_data = await rom.readFrontalPokemonData(citra, 3);
    let fifth_data = await rom.readFrontalPokemonData(citra, 4);
    let sixth_data = await rom.readFrontalPokemonData(citra, 5);

    let first_dex_number = first_data.subarray(0).readUInt16LE()
    let second_dex_number = second_data.subarray(0).readUInt16LE()
    let third_dex_number = third_data.subarray(0).readUInt16LE()
    let fourth_dex_number = fourth_data.subarray(0).readUInt16LE()
    let fifth_dex_number = fifth_data.subarray(0).readUInt16LE()
    let sixth_dex_number = sixth_data.subarray(0).readUInt16LE()

    if (validatePokemon(sixth_dex_number) || validatePokemon(fifth_dex_number)) {
        if (combatEnv === CombatEnv.WILD) {
            this.combat_type = CombatType.HORDE;
            return [CombatType.HORDE, [first_dex_number], [second_dex_number, third_dex_number, fourth_dex_number, fifth_dex_number, sixth_dex_number]];
        } else {
            return [CombatType.TRIPLE, [first_dex_number, third_dex_number, fifth_dex_number], [second_dex_number, fourth_dex_number, sixth_dex_number]];
        }
    } else if (validatePokemon(third_dex_number) || validatePokemon(fourth_dex_number)) {
        if (combatEnv === CombatEnv.WILD) {
            this.combat_type = CombatType.HORDE;
            return [CombatType.HORDE, [first_dex_number, third_dex_number], [second_dex_number, fourth_dex_number]];
        } else {
            return [CombatType.DOUBLE, [first_dex_number, third_dex_number], [second_dex_number, fourth_dex_number]];
        }
    } else if (validatePokemon(first_dex_number) || validatePokemon(second_dex_number)) {
        return [CombatType.NORMAL, [first_dex_number], [second_dex_number]];
    }

    return [CombatType.OFF, [], []];
}

async function manageMoveLog(citra, address) {
    const message = await rom.readMessageBox(citra, address);
    if (!message) {
        return;
    }

    const last_move = combat_move_log_messages[combat_move_log_messages.length - 1];
    if (!last_move || (last_move && last_move.message !== message)) {
        combat_move_log_messages.push({
            key: combat_move_log_messages.length,
            message: message
        });
        hasChanged = true;
    }
}

async function manageCombatLog(citra, address) {
    const message = await rom.readMessageBox(citra, address);
    if (!message) {
        return;
    }

    if (!combat_log_messages.includes(message)) {
        combat_log_messages.push(message);
        hasChanged = true;
    }


    if (message.includes('va a sacar a ')) {
        const removed_trainer_thrash = message.split('va a sacar a ')[1];
        const next_pokemon_clean = removed_trainer_thrash.split('!')[0]
        nextPokemon = next_pokemon_clean.toLowerCase();
    } else {
        nextPokemon = null;
    }
}

async function manageTrainerLog(citra, address) {
    const message = (await rom.readMessageBox(citra, address)).toLowerCase();
    if (!message) {
        return;
    }

    if (!trainer_log_messages.includes(message)) {
        const event_regex = /reto opcional (\d) del tramo (\d)/
        const results = message.match(event_regex);
        if (results) {
            trainer_log_messages.push(message);
            hasChanged = true;
        }
    }
}

export async function gatherData(citra) {
    let combatEnv = await isInCombat(citra);
    if (combatEnv !== CombatEnv.OFF) {
        const [combatType, allySideSelection, enemySelection] = await getCombatType(citra, combatEnv);
        const total_combat_data_slots = 24;
        const combat_data_address = rom.getBattleDataAddress(combatEnv);
        const combat_addresses = rom.getBattleData(combatEnv);
        for (let slot = 0; slot < total_combat_data_slots; slot++) {
            let slot_address = combat_data_address + (slot * combat_addresses.combat_data.mon_gap);
            let mon_data = await citra.readMemory(slot_address, combat_addresses.combat_data.slot_data_size);
            let pokemon = new InBattlePokemonData(mon_data);
            if (pokemon && !validateBattleData(pokemon)) {
                continue
            }

            if (combat_addresses.your_team.battle_data_slots.includes(pokemon.battle_slot)) {
                if (JSON.stringify(your_battle_data[pokemon.battle_slot], replacer) !== JSON.stringify(pokemon, replacer)) {
                    your_battle_data[pokemon.battle_slot] = pokemon;
                    hasChanged = true;

                }
            } else if (combat_addresses.ally_team.battle_data_slots.includes(pokemon.battle_slot)) {
                if (JSON.stringify(ally_npc_battle_data[pokemon.battle_slot], replacer) !== JSON.stringify(pokemon, replacer)) {
                    ally_npc_battle_data[pokemon.battle_slot] = pokemon;
                    hasChanged = true;
                    hasAlly = true;
                }
            } else if (combat_addresses.enemy_team.battle_data_slots.includes(pokemon.battle_slot)) {
                if (JSON.stringify(enemy_battle_data[pokemon.battle_slot], replacer) !== JSON.stringify(pokemon, replacer)) {
                    enemy_battle_data[pokemon.battle_slot] = pokemon;
                    hasChanged = true;

                }
            } else {
                console.error(`team not found for battle data slot ${slot} with data ${JSON.stringify(pokemon, replacer)}`)
                logger.error(`team not found for battle data slot ${slot} with data ${JSON.stringify(pokemon, replacer)}`)
            }
        }
        await manageMoveLog(citra, combat_addresses.combat_data.move_log);
        await manageCombatLog(citra, combat_addresses.combat_data.combat_log);
        await manageTrainerLog(citra, combat_addresses.combat_data.trainer_log);
        let _hasChanged = false;
        if (hasChanged) {
            _hasChanged = true;
            hasChanged = false;
        }

        let yourSelection = allySideSelection.slice();
        let allySelection = [];
        if (hasAlly) {
            [yourSelection, allySelection] = allySideSelection;
        }

        return {
            in_combat: combatEnv,
            combat_type: combatType,
            your_selection: yourSelection,
            ally_selection: allySelection,
            enemy_selection: enemySelection,
            trainer_log_messages: trainer_log_messages,
            combat_log_messages: combat_log_messages,
            combat_move_log_messages: combat_move_log_messages,
            has_changed: _hasChanged,
            battle_data: {
                you: your_battle_data,
                enemy: enemy_battle_data,
                ally: ally_npc_battle_data
            },
            next_pokemon: nextPokemon
        }
    }

    your_battle_data = {}
    ally_npc_battle_data = {}
    enemy_battle_data = {}

    return {
        in_combat: 'OFF',
        combat_type: 'OFF',
        ally_selection: [],
        enemy_selection: [],
        trainer_log_messages: [],
        combat_log_messages: [],
        combat_move_log_messages: [],
        battle_data: {
            you: your_battle_data,
            enemy: enemy_battle_data,
            ally: ally_npc_battle_data
        },
        next_pokemon: null,
        has_changed: true
    }
}

export default {
    gatherData: gatherData
}
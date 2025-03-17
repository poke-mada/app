import {CitraClient, InBattlePokemonData} from "@/api/ram_editor";
import {RAM_ROM, RAM_ROM as rom} from '@/stores/back_constants'

export const CombatType = Object.freeze({
    OFF: "OFF",
    HORDE: "HORDE",
    NORMAL: "NORMAL",
    DOUBLE: "DOUBLE",
    TRIPLE: "TRIPLE"
});

export const CombatEnv = Object.freeze({
    OFF: "OFF",
    WILD: "WILD",
    TRAINER: "TRAINER",
    SPECIAL: "SPECIAL",
    MULTI: "MULTI"
});

export const TeamOwner = Object.freeze({
    YOU: 'YOU',
    ENEMY: 'ENEMY',
    ALLY: 'ALLY'
});
export const SLOT_OFFSET = 484;
export const SLOT_DATA_SIZE = 232;
export const STAT_DATA_SIZE = 22;

export async function getOrCreatePokemonItem(item, quantity, add_flag = false, citra = new CitraClient()) {
    let slot = 0;
    const item_slot_offset = 4;
    const bag_address = rom.item_data.items;
    const specific_bag_address = getBagAddress(rom.item_data, item);
    const bag_limit = 256;
    let current_offset = 0;
    console.log(`Adding x${quantity} ${item}`)

    while (current_offset <= bag_limit) {
        const read_address = bag_address - specific_bag_address + slot * item_slot_offset;
        let message_data = await citra.readMemory(read_address, item_slot_offset);
        const current_item = message_data.readUInt16LE();
        const current_quantity = message_data.readUInt16LE(2);

        if (current_item === item) {
            let new_quantity = quantity;
            if (add_flag) {
                new_quantity = current_quantity + quantity;
            }

            let new_data = Buffer.alloc(4);
            new_data.writeUint16LE(item, 0)
            new_data.writeUint16LE(new_quantity, 2)
            await citra.writeMemory(read_address, new_data)
            return read_address
        }
        if (current_item === 0) {
            let new_data = Buffer.alloc(4);
            new_data.writeUint16LE(item, 0)
            new_data.writeUint16LE(quantity, 2)
            await citra.writeMemory(read_address, new_data)
            return read_address
        }
        slot += 1
        current_offset += item_slot_offset
    }
}

// eslint-disable-next-line no-unused-vars
export async function getBagAddress(item_data, item_index) {
    return item_data.meds;
}

// eslint-disable-next-line no-unused-vars
export async function setPokemon(pokemon_data, slot = 1, citra = new CitraClient()) {
    await citra.writeMemory(rom.partyAddress + slot * SLOT_OFFSET, pokemon_data)
}

export async function modifyPokemonBattleData(slot = 0, boosts, citra = new CitraClient()) {
    let combat_data_address = rom.getBattleDataAddress(CombatEnv.TRAINER);
    let slot_address = combat_data_address + (slot * rom.mongap);
    let mon_data = await citra.readMemory(slot_address, rom.slot_data_size);
    let pokemon = new InBattlePokemonData(rom, mon_data);

    for (const [boost, modifier] of Object.entries(boosts)) {
        pokemon.boosts[boost] += modifier;
    }

    await citra.writeMemory(slot_address, pokemon.toWrittableBytes())
}

export async function modifyPokemonData(slot, newData, citra = new CitraClient()) {
    const slot_address = RAM_ROM.getBattleDataAddress()
    await citra.writeMemory(slot_address, pokemon.toWrittableBytes())
}
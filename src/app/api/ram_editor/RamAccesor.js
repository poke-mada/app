import {CitraClient, InBattlePokemonData} from "@/app/api/ram_editor";
import {RAM_ROM as rom, RAM_ROM2 as rom2} from '@/stores/back_constants'
import {decryptPokemonData, encryptData, regeneratePokemonInnerChecksum} from "@/app/api/lib/PokemonCrypt";

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

export async function giveMoneyToPlayer(quantity, citra = new CitraClient()) {
    const money_address = rom2.item_data.items;
    const money_data = await citra.readMemory(money_address, 4);
    const money = money_data.readUInt32LE();
    const new_money = money + quantity;
    let new_data = Buffer.alloc(4);
    new_data.writeUint32LE(new_money);
    await citra.writeMemory(money_address, new_data);
}

export async function getOrCreatePokemonItem(bag, item, quantity, add_flag = false, citra = new CitraClient()) {
    let slot = 0;
    const item_slot_offset = 4;
    const bag_address = rom2.item_data.items;
    const specific_bag_address = getBagAddress(rom2.item_data, bag);
    const bag_limit = getBagLength(rom2.item_data, bag);
    let current_offset = 0;
    console.log(`Adding x${quantity} ${item} to ${bag}`)
    while (current_offset <= bag_limit) {
        const read_address = bag_address - specific_bag_address + slot * item_slot_offset;
        let message_data = await citra.readMemory(read_address, item_slot_offset);
        const current_item = message_data.readUInt16LE();
        const current_quantity = message_data.readUInt16LE(2);

        if (current_item === item) {
            console.log(`found item ${item} x${current_quantity}`)
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
            console.log(`item ${item} not found`)
            let new_data = Buffer.alloc(4);
            new_data.writeUint16LE(item, 0)
            new_data.writeUint16LE(quantity, 2)
            await citra.writeMemory(read_address, new_data)
            return read_address
        }
        slot += 1
        current_offset += item_slot_offset
    }
    throw new Error("not enough space in the bag")
}

export async function readPokemonBag(bag_name, citra = new CitraClient()) {
    let items = [];
    let slot = 0;
    const item_slot_offset = 4;
    const bag_address = rom2.item_data.items;
    const specific_bag_address = getBagAddress(rom2.item_data, bag_name);
    const bag_limit = getBagLength(rom2.item_data, bag_name);
    let current_offset = 0;

    while (current_offset <= bag_limit) {
        const read_address = bag_address - specific_bag_address + slot * item_slot_offset;
        let message_data = await citra.readMemory(read_address, item_slot_offset);
        const current_item = message_data.readUInt16LE();
        const current_quantity = message_data.readUInt16LE(2);

        if (current_item === 0) {
            break;
        }

        if (current_item !== 113) {
            items.push([current_item, current_quantity, bag_name])
        }

        slot += 1
        current_offset += item_slot_offset
    }

    return items;
}


// eslint-disable-next-line no-unused-vars
export function getBagAddress(item_data, bag_name) {
    return item_data[`${bag_name}_offset`];
}

// eslint-disable-next-line no-unused-vars
export function getBagLength(item_data, bag_name) {
    return item_data[`${bag_name}_length`];
}

// eslint-disable-next-line no-unused-vars
export async function setPokemon(pokemon_data, slot = 1, citra = new CitraClient()) {
    await citra.writeMemory(rom.partyAddress + slot * SLOT_OFFSET, pokemon_data)
}

export async function modifyPokemonBattleData(slot = 0, boosts, citra = new CitraClient()) {
    let combat_data_address = rom.getBattleDataAddress(CombatEnv.TRAINER);
    let slot_address = combat_data_address + (slot * rom.mongap);
    let mon_data = await citra.readMemory(slot_address, rom.slot_data_size);
    let pokemon = new InBattlePokemonData(mon_data);

    for (const [boost, modifier] of Object.entries(boosts)) {
        console.log(pokemon);
        console.log(boost);
        pokemon.boosts[boost] += modifier;
    }

    await citra.writeMemory(slot_address, pokemon.toWrittableBytes())
}

export async function modifyPokemonData(slot, newData, citra = new CitraClient()) {
    let slot_address = rom2.getTeamSlotAddress(slot);
    let oldData = await citra.readMemory(slot_address, rom2.player_team_data.slot_data_size);
    let decryptedData = decryptPokemonData(Buffer.concat([oldData, Buffer.alloc(22)]));

    decryptedData.writeUint8(newData.ability, rom2.pokemon_data.ability)
    const newChecksum = regeneratePokemonInnerChecksum(decryptedData);

    decryptedData.writeUint16LE(newChecksum, rom2.pokemon_data.checksum)
    const encData = encryptData(decryptedData).subarray(0, 232);

    await citra.writeMemory(slot_address, encData)
}
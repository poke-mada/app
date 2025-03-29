import {SAVE_ROM} from "@/stores/back_constants";
import {SavePokemon} from "@/api/save_editor/SavePokemon";
import {validatePokemonData, validatePokemonSaveData} from "@/api/lib/validators";


export default {
    writePokemon(saveData, pokemonData, box, slot) {
        let newData = Buffer.copyBytesFrom(saveData);
        pokemonData.copy(newData, SAVE_ROM.getBoxSlotAddress(box, slot), 0, SAVE_ROM.box_data.slot_length)
        return newData;
    },
    firstFreeSlot(saveData) {
        for (let box = 0; box < 7; box++) {
            for (let slot = 0; slot < 6; slot++) {
                try {
                    let address = SAVE_ROM.getBoxSlotAddress(box, slot)
                    let maxedData = Buffer.alloc(260);
                    let pokemonData = saveData.subarray(address, address + SAVE_ROM.box_data.slot_length);
                    maxedData.set(pokemonData, 0)
                    const pokemon = new SavePokemon(maxedData);
                    if (!validatePokemonSaveData(pokemon)) {
                        return {box, slot};
                    }
                } catch (e) {
                    console.log(box, slot);
                    throw e;
                }
            }
        }
        return {
            box: -1,
            slot: -1
        };
    }
}
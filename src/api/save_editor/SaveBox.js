import {SAVE_ROM} from "@/stores/back_constants";
import {SavePokemon} from "@/api/save_editor/SavePokemon";
import {validatePokemonData} from "@/api/lib/validators";


export default {
    writePokemon(saveData, pokemonData, box, slot) {
        let newData = Buffer.copyBytesFrom(saveData);
        pokemonData.copy(newData, SAVE_ROM.getBoxSlotAddress(box, slot), 0, SAVE_ROM.box_data.slot_length)
        return newData;
    },
    firstFreeSlot(saveData) {
        for (let box = 0; box < 7; box++) {
            for (let slot = 0; slot < 6; slot++) {
                let address = SAVE_ROM.getBoxSlotAddress(box, slot)
                let pokemonData = saveData.subarray(address, address + SAVE_ROM.box_data.slot_length);
                const pokemon = new SavePokemon(pokemonData);
                if (!validatePokemonData(pokemon)) {
                    return {box, slot};
                }
            }
        }
        return {
            box: -1,
            slot: -1
        };
    }
}
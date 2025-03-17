import {SAVE_ROM} from "@/stores/back_constants";
import {validatePokemonData} from '@/api/lib/validators';
import {SavePokemon} from '@/api/save_editor/SavePokemon';
import {logger} from "@/api/handlers/logging";

export default {
    firstFreeSlot(saveData) {
        for (let slot = 0; slot < 6; slot++) {
            let address = SAVE_ROM.getTeamSlotAddress(slot)
            let pokemonData = saveData.subarray(address, address + SAVE_ROM.team_data.slot_length);
            const pokemon = new SavePokemon(pokemonData);
            if (!validatePokemonData(pokemon)) {
                return slot;
            }
        }
        return -1;
    },
    writePokemon(saveData, pokemonData, slot) {
        let newData = Buffer.copyBytesFrom(saveData);
        logger.info('old data')
        logger.info(newData.subarray(SAVE_ROM.team_data.party_address, SAVE_ROM.team_data.party_address + SAVE_ROM.team_data.slot_length * 6))
        pokemonData.copy(newData, SAVE_ROM.getTeamSlotAddress(slot), 0, SAVE_ROM.team_data.slot_length)
        logger.info('new data')
        logger.info(newData.subarray(SAVE_ROM.team_data.party_address, SAVE_ROM.team_data.party_address + SAVE_ROM.team_data.slot_length * 6))
        return newData;
    }
}
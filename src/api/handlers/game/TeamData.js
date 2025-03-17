import {RAM_ROM2 as rom} from '@/stores/back_constants';
import {PokemonTeamData} from "@/api/ram_editor";
import {validatePokemonData} from "@/api/lib/validators";
import {SavePokemon} from "@/api/save_editor/SavePokemon";

let your_team_data = {}
const emptySlot = SavePokemon.getEmptySlot();
let hasChanged = false;


export async function gatherYourInfo(citra, combat_info, firstUpdate) {
    const battle_data = combat_info.battle_data.you
    let slots = 6;
    const team_data = rom.player_team_data;
    for (let slot = 0; slot < slots; slot++) {
        let slot_address = team_data.address + (slot * team_data.slot_offset)
        let pokemonData = await citra.readMemory(slot_address, team_data.slot_data_size);
        let statsData = await citra.readMemory(slot_address + team_data.slot_data_size + 112, team_data.stat_data_size);

        if (pokemonData && statsData) {
            let data = Buffer.concat([pokemonData, statsData]);
            let move_data_address = team_data.pp_address + rom.wild_battle_data.combat_data.mon_gap * slot;
            let move_data = await citra.readMemory(move_data_address, 56);
            let pokemon = new PokemonTeamData(move_data, data);
            if (validatePokemonData(pokemon)) {
                pokemon.setBattleData(battle_data[slot]);
                if (JSON.stringify(your_team_data[slot]) === JSON.stringify(pokemon)) continue;
                your_team_data[slot] = pokemon;
                hasChanged = true;

            } else if (emptySlot.equals(data) && your_team_data[slot]) {
                delete your_team_data[slot];
                hasChanged = true;
            }
        }
    }
    let _hasChanged = false;
    if (hasChanged) {
        _hasChanged = true;
        hasChanged = false;
    }
    return {
        selected_pokemon: combat_info.your_selection,
        team: Object.values(your_team_data),
        hasChanged: firstUpdate || _hasChanged
    }
}

export async function gatherEnemyInfo(citra, battle_data) {
    return {}
}

export async function gatherAllyInfo(citra, battle_data) {
    return {}
}


export default {
    gatherYourInfo: gatherYourInfo,
    gatherEnemyInfo: gatherEnemyInfo,
    gatherAllyInfo: gatherAllyInfo
}
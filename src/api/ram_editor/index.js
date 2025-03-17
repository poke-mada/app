import {PokemonTeamData as _PokemonTeamData} from "@/api/ram_editor/PokemonTeamData";
import {InBattlePokemonData as _InBattlePokemonData} from "@/api/ram_editor/InBattlePokemonData";
import {CitraClient as _CitraClient} from "@/api/ram_editor/CitraClient";
import {truncateBuffer as _truncateBuffer} from '@/api/ram_editor/RamData'



export const PokemonTeamData = _PokemonTeamData;
export const truncateBuffer = _truncateBuffer;
export const InBattlePokemonData = _InBattlePokemonData;
export const CitraClient = _CitraClient;

export default {
    PokemonTeamData,
    truncateBuffer,
    InBattlePokemonData,
    CitraClient
};
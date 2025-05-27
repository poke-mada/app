import SaveTeam from '@/app/api/save_editor/SaveTeam';
import SaveBox from '@/app/api/save_editor/SaveBox';
import {
    IS_DEV,
    GLOBAL_CONFIG,
    SAVE_ROM,
    emmiter,
    declareGlobalConfig,
    SAVE_FILE_LIME3 as SAVE_FILE
} from "@/stores/back_constants";
import fs from "fs";
import {logger} from "@/app/api/handlers/logging";
import FormData from "form-data";
import {session} from "@/stores/backend";
import {
    decryptPokemonData,
    encryptData,
    get_string,
    regeneratePokemonInnerChecksum,
    updateBlockChecksums
} from "@/app/api/lib/PokemonCrypt";
import {SavePokemon} from "@/app/api/save_editor/SavePokemon";


const PokemonLocations = Object.freeze({
    BOXES: 'BOXES',
    TEAM: 'TEAM'
})

function readSaveBytes() {
    return fs.readFileSync(SAVE_FILE)
}

export function writeSaveBytes(newData) {
    try {
        const checksumedData = updateBlockChecksums(newData);
        fs.writeFileSync(SAVE_FILE, checksumedData);
        return true;
    } catch (e) {
        logger.error(e)
        console.error(e)
        return false;
    }
}

export function getOrCreateSaveItem(bag, item, quantity, add_flag = false) {

}

export function addPokemonSaveData(pokemonData, toBox = false) {
    let saveData = readSaveBytes();
    let teamSlot = SaveTeam.firstFreeSlot(saveData);
    let newData;
    if (teamSlot === -1 || toBox) {
        const boxData = SaveBox.firstFreeSlot(saveData);
        console.log(`Editing box slot ${boxData.box}:${boxData.slot}`)
        newData = SaveBox.writePokemon(saveData, pokemonData, boxData.box, boxData.slot)
    } else {
        console.log(`Editing team slot #${teamSlot + 1}`)
        newData = SaveTeam.writePokemon(saveData, pokemonData, teamSlot)
    }

    return newData
}

export function getSaveName() {
    const SAVE_BYTES = readSaveBytes();
    const offset = 0x14000
    const length = 0x00170
    const trainer_memory_block = SAVE_BYTES.subarray(offset, offset + length)

    const original_thrash_nick = trainer_memory_block.subarray(0x48, 0x48 + 0x1A)

    return get_string(original_thrash_nick);
}

function fileWatcher() {
    let trainer_name = getSaveName()
    emmiter.emit('perform_save')

    const formData = new FormData();
    formData.append('file', fs.createReadStream(SAVE_FILE), {
        filename: trainer_name
    });

    if (IS_DEV) {
        return;
    }
    if (GLOBAL_CONFIG.token) {
        session.post(`/upload_save/`, formData, {
            headers: {
                Authorization: `Token ${GLOBAL_CONFIG.token}`,
                ...formData.getHeaders(),  // Añade los encabezados necesarios para multipart/form-data
            },
        }).then(() => console.log('succeeded')).catch(() => {
        })
    }
}

function watchSaveFile(save_file) {
    if (!fs.existsSync(save_file)) {
        console.log(save_file)
        console.log('file cannot be read')
        return;
    }

    fs.watchFile(save_file, {
        bigint: true,
        persistent: false,
        interval: 1000
    }, fileWatcher)
}

export function watchSave() {
    socket.on('connection', event => {
        declareGlobalConfig('overlay_event', event)
    });
    watchSaveFile(SAVE_FILE);
}

export const stopWatching = function (FILE_NAME) {
    try {
        fs.unwatchFile(FILE_NAME)
    } catch (e) {
        console.log('file not read')
        logger.error(e)
    }
}

export function modifyPokemonSaveData(slot, new_data) {
    console.log(`modifying save slot #${slot}`)
    let saveData = readSaveBytes();

    const slotAddress = SAVE_ROM.getTeamSlotAddress(slot);
    const oldData = saveData.subarray(slotAddress, slotAddress + SAVE_ROM.team_data.slot_length);

    const pokemonData = decryptPokemonData(oldData);

    pokemonData.set([new_data.ability], SAVE_ROM.pokemon_data.ability_num)

    const newChecksum = regeneratePokemonInnerChecksum(pokemonData);
    const checksum = Buffer.alloc(2);
    checksum.writeUint16LE(newChecksum)
    pokemonData.set(checksum, SAVE_ROM.pokemon_data.checksum)
    const encData = encryptData(pokemonData).subarray(0, 232);

    const newData = SaveTeam.writePokemon(saveData, encData, slot)
    const created = writeSaveBytes(newData);
    return [false, created]
}

export function clearPokemonSaveData(slot) {
    let saveData = readSaveBytes();
    let newData;
    newData = SaveTeam.writePokemon(saveData, SavePokemon.getEmptySlot(), slot)
    const created = writeSaveBytes(newData);
    return [false, created]
}
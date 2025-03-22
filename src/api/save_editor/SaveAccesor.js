import SaveTeam from '@/api/save_editor/SaveTeam';
import SaveBox from '@/api/save_editor/SaveBox';
import {IS_DEV, SAVE_FILE, GLOBAL_CONFIG, SAVE_ROM} from "@/stores/back_constants";
import fs from "fs";
import {logger} from "@/api/handlers/logging";
import FormData from "form-data";
import {session} from "@/stores/backend";
import {decryptPokemonData, encryptData, get_string, getSaveChecksum, updateChecksum} from "@/api/lib/PokemonCrypt";
import {SavePokemon} from "@/api/save_editor/SavePokemon";
import {socket} from "@/api/handlers/events";


const PokemonLocations = Object.freeze({
    BOXES: 'BOXES',
    TEAM: 'TEAM'
})

function readSaveBytes() {
    return fs.readFileSync(SAVE_FILE)
}

function writeSaveBytes(newData) {
    try {
        const checksumData = Buffer.copyBytesFrom(newData);
        const blockMetadataOffset = 0x65600 - 0x200;
        const partyChecksumAddress = blockMetadataOffset + 0xAA
        checksumData.writeUint16LE(getSaveChecksum(newData), partyChecksumAddress)
        fs.writeFileSync(SAVE_FILE, checksumData);
        return true;
    } catch (e) {
        logger.error(e)
        console.error(e)
        return false;
    }
}

export function addPokemonSaveData(pokemonData) {
    let createdIn = PokemonLocations.TEAM;
    let saveData = readSaveBytes();
    let teamSlot = SaveTeam.firstFreeSlot(saveData);
    let newData;
    if (teamSlot === -1) {
        createdIn = PokemonLocations.BOXES;
        const boxData = SaveBox.firstFreeSlot(saveData);
        console.log(`Editing box slot ${boxData.box}:${boxData.slot}`)
        newData = SaveBox.writePokemon(saveData, pokemonData, boxData.box, boxData.slot)
    } else {
        console.log(`Editing team slot #${teamSlot + 1}`)
        newData = SaveTeam.writePokemon(saveData, pokemonData, teamSlot)
    }

    const created = writeSaveBytes(newData);

    return [createdIn, created]
}

export function getSaveName() {
    const SAVE_BYTES = readSaveBytes();
    const offset = 0x14000
    const length = 0x00170
    const trainer_memory_block = SAVE_BYTES.subarray(offset, offset + length)

    const original_thrash_nick = trainer_memory_block.subarray(0x48, 0x48 + 0x1A)

    return get_string(original_thrash_nick);
}

export function serializeSaveData() {
    const saveData = readSaveBytes();
    const badges = saveData.subarray(0x04200, 17216).subarray(SAVE_ROM.badge_address).readUInt8();
    const pokemon1 = SaveTeam.getPokemonAt(saveData, 0);
    const pokemon2 = SaveTeam.getPokemonAt(saveData, 1);
    const pokemon3 = SaveTeam.getPokemonAt(saveData, 2);
    const pokemon4 = SaveTeam.getPokemonAt(saveData, 3);
    const pokemon5 = SaveTeam.getPokemonAt(saveData, 4);
    const pokemon6 = SaveTeam.getPokemonAt(saveData, 5);

    return {
        "gym1": (badges & (1 << 0)) !== 0,
        "gym2": (badges & (1 << 1)) !== 0,
        "gym3": (badges & (1 << 2)) !== 0,
        "gym4": (badges & (1 << 3)) !== 0,
        "gym5": (badges & (1 << 4)) !== 0,
        "gym6": (badges & (1 << 5)) !== 0,
        "gym7": (badges & (1 << 6)) !== 0,
        "gym8": (badges & (1 << 7)) !== 0,
        "deathCount": 12,
        "team": [
            pokemon1 !== null ? pokemon1.toOverlayData() : null,
            pokemon2 !== null ? pokemon2.toOverlayData() : null,
            pokemon3 !== null ? pokemon3.toOverlayData() : null,
            pokemon4 !== null ? pokemon4.toOverlayData() : null,
            pokemon5 !== null ? pokemon5.toOverlayData() : null,
            pokemon6 !== null ? pokemon6.toOverlayData() : null
        ]
    };
}

export function watchSave() {
    console.log("wenas")
    if (!fs.existsSync(SAVE_FILE)) {
        console.log(SAVE_FILE)
        console.log('file cannot be read')
        return;
    }
    let trainer_name = getSaveName()
    socket.on('connection', event => {
        fs.watchFile(SAVE_FILE, {
            bigint: true,
            persistent: false,
            interval: 1000
        }, () => {
            console.log('WATCHING FILE')
            const serializedSave = serializeSaveData();
            console.log(serializedSave)
            event.send(JSON.stringify(serializedSave));

            const formData = new FormData();
            formData.append('file', fs.createReadStream(SAVE_FILE), {
                filename: trainer_name
            });
            if (IS_DEV) {
                console.log('upload faked')
                return;
            }
            if (GLOBAL_CONFIG.win !== undefined) {
                GLOBAL_CONFIG.win.webContents.executeJavaScript('localStorage.getItem("api_token");', true)
                    .then(result => {
                        session.post(`/upload_save/`, formData, {
                            headers: {
                                Authorization: `Token ${result}`,
                                ...formData.getHeaders(),  // Añade los encabezados necesarios para multipart/form-data
                            },
                        }).then(() => console.log('succeeded')).catch((err) => console.error(err))
                    });
            }
        })
    });
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

    const newChecksum = updateChecksum(pokemonData);
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
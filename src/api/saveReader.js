import fs from 'fs'

import FormData from 'form-data';
import {session} from "@/store";


export function getSaveName(FILE_PATH) {
    const SAVE_BYTES = fs.readFileSync(FILE_PATH);
    const offset = 0x14000
    const length = 0x00170
    const trainer_memory_block = SAVE_BYTES.subarray(offset, offset + length)

    const original_thrash_nick = trainer_memory_block.subarray(0x48, 0x48 + 0x1A)

    return get_string(original_thrash_nick);
}

export const watchSave = function (FILE_NAME) {
    if (!fs.existsSync(FILE_NAME)) {
        console.log(FILE_NAME)
        console.log('file cannot be read')
        return;
    }
    let trainer_name = getSaveName(FILE_NAME)
    fs.watchFile(FILE_NAME, {
        bigint: true,
        persistent: false,
        interval: 2000
    }, () => {
        const formData = new FormData();
        formData.append('file', fs.createReadStream(FILE_NAME), {
            filename: trainer_name
        });
        session.post(`/upload_save/`, formData, {
            headers: {
                ...formData.getHeaders(),  // Añade los encabezados necesarios para multipart/form-data
            },
        }).then(() => console.log('succeeded')).catch(() => console.error('failed'))
    })
}
export const stopWatching = function (FILE_NAME) {
    try {
        fs.unwatchFile(FILE_NAME)
    } catch (e) {
        console.log('file not read')
    }
}

function normalize_gender_symbol(value) {
    switch (value) {
        case '\uE08E':
            return '\u2642';
        case '\uE08F':
            return '\u2640';
    }
    return value;
}

function load_string(data, result) {
    let ctr = 0
    let i = 0

    while (i < data.length) {
        let value = data.slice(i).readUInt16LE()
        if (value === 0) {
            break
        }
        result.push(normalize_gender_symbol(String.fromCharCode(value)))
        i += 2;
        ctr++;
    }
    return ctr
}

function get_string(data) {
    let result = []


    let length = load_string(data, result)
    return result.slice(0, length).join('')  // Crear una cadena con los caracteres procesados
}
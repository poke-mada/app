/* eslint-disable no-undef */

import {SAVE_ROM} from "@/stores/back_constants";

let BLOCK_SIZE = 56

const crypt = (data, seed, i) => {
    let value = data[i];
    let shiftedSeed = (seed >> 16) & 0xFF;
    value ^= shiftedSeed;
    let result = Buffer.from([value]);

    value = data[i + 1];
    shiftedSeed = (seed >> 24) & 0xFF;
    value ^= shiftedSeed;
    result = Buffer.concat([result, Buffer.from([value])]);

    return result;
};

const cryptArray = (data, seed, start, end) => {
    let result = Buffer.alloc(0);
    let tempSeed = BigInt(seed);

    for (let i = start; i < end; i += 2) {
        tempSeed = (tempSeed * BigInt(0x41C64E6D)) & BigInt(0xFFFFFFFF);
        tempSeed += BigInt(0x00006073);
        tempSeed &= BigInt(0xFFFFFFFF);

        const cryptResult = crypt(data, Number(tempSeed), i);
        result = Buffer.concat([result, cryptResult]);
    }

    return result;
};

const shuffleArray = (data, sv, blockSize) => {
    const blockPosition = [
        [0, 0, 0, 0, 0, 0, 1, 1, 2, 3, 2, 3, 1, 1, 2, 3, 2, 3, 1, 1, 2, 3, 2, 3],
        [1, 1, 2, 3, 2, 3, 0, 0, 0, 0, 0, 0, 2, 3, 1, 1, 3, 2, 2, 3, 1, 1, 3, 2],
        [2, 3, 1, 1, 3, 2, 2, 3, 1, 1, 3, 2, 0, 0, 0, 0, 0, 0, 3, 2, 3, 2, 1, 1],
        [3, 2, 3, 2, 1, 1, 3, 2, 3, 2, 1, 1, 3, 2, 3, 2, 1, 1, 0, 0, 0, 0, 0, 0]
    ];

    let result = Buffer.alloc(0);
    for (let block = 0; block < 4; block++) {
        const start = blockSize * blockPosition[block][sv];
        const end = start + blockSize;
        result = Buffer.concat([result, data.slice(start, end)]);
    }

    return result;
};

const decryptPokemonData = (encryptedData) => {
    const seed = encryptedData.readUInt32LE(0);
    const sv = ((seed >> 13) & 31) % 24;

    const start = 8;
    const end = 232;

    const header = encryptedData.slice(0, 8);

    // Blocks
    const blocks = cryptArray(encryptedData, seed, start, end);

    // Stats
    const stats = cryptArray(encryptedData, seed, end, encryptedData.length);

    return Buffer.concat([header, shuffleArray(blocks, sv, BLOCK_SIZE), stats]);
};

const encryptData = (decryptedData) => {
    const seed = decryptedData.readUInt32LE(0);
    const sv = ((seed >> 13) & 31) % 24;

    const start = 8;
    const end = 232;

    const header = decryptedData.slice(0, 8);

    // Reordenar los bloques encriptados a su posición original
    const shuffledBlocks = shuffleArray(decryptedData.slice(start, end), sv, BLOCK_SIZE);

    // Encriptar los bloques
    const encryptedBlocks = cryptArray(shuffledBlocks, seed, 0, shuffledBlocks.length);

    // Encriptar las estadísticas
    const encryptedStats = cryptArray(decryptedData, seed, end, decryptedData.length);

    return Buffer.concat([header, encryptedBlocks, encryptedStats]);
};

export {decryptPokemonData, encryptData};

export default {
    decryptData: decryptPokemonData
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

export function get_string(data) {
    let result = []

    let length = load_string(data, result)
    return result.slice(0, length).join('')  // Crear una cadena con los caracteres procesados
}

function add16(buffer) {
    if (!Buffer.isBuffer(buffer)) {
        throw new TypeError('Input must be a Buffer');
    }

    let checksum = 0;

    for (let i = 0; i < buffer.length; i += 2) {
        let u16 = buffer.readUInt16LE(i);
        checksum = (checksum + u16) & 0xFFFF; // Ensure 16-bit overflow
    }

    return checksum;
}

export function updateChecksum(pokemonData) {
    return add16(pokemonData.subarray(8, SAVE_ROM.box_data.slot_length))
}

function crc16CCITT(data) {
    let top = 0xFF;
    let bot = 0xFF;

    for (const b of data) {
        let x = b ^ top;
        x ^= (x >> 4);
        top = (bot ^ (x >> 3) ^ (x << 4)) & 0xFF;
        bot = (x ^ (x << 5)) & 0xFF;
    }

    return (top << 8) | bot;
}

export function getSaveChecksum(saveData, offset = 0x14200, length = 1564) {
    const chkData = saveData.subarray(offset, offset + length)
    return crc16CCITT(chkData)
}
import path from "path";
import {XY as SAVE_XY} from "@/app/api/save_editor/SaveData";
import {XY as RAM_XY} from "@/app/api/ram_editor/romData";
import {XY as RAM_XY2} from "@/app/api/ram_editor/RamData";
import {EventEmitter} from "events";


let BASE_URL;
const DEV = false;
if (DEV) {
    BASE_URL = 'http://localhost:8000';
} else {
    BASE_URL = 'https://pokemon.para-mada.com';
}

const SAVE_FILE_PATH_CITRA = path.join(
    process.env.APPDATA, 'Citra', 'sdmc', 'Nintendo 3DS',
    '00000000000000000000000000000000', '00000000000000000000000000000000',
    'title', '00040000', '00055d00', 'data', '00000001', 'main'
);
const SAVE_FILE_PATH_LIME = path.join(
    process.env.APPDATA, 'Lime3DS', 'sdmc', 'Nintendo 3DS',
    '00000000000000000000000000000000', '00000000000000000000000000000000',
    'title', '00040000', '00055d00', 'data', '00000001', 'main'
);

const MODS_FILE_PATH_LIME = path.join(
    process.env.APPDATA, 'Lime3DS', 'load', 'mods', '0004000000055D00'
)

let globalConfigObject = {}

export const emmiter = new EventEmitter();
export const GLOBAL_CONFIG = globalConfigObject;
export const SAVE_ROM = SAVE_XY;
export const RAM_ROM = RAM_XY;
export const RAM_ROM2 = RAM_XY2;
export const SERVER_URL = BASE_URL;
export const IS_DEV = DEV;
export const SAVE_FILE_CITRA = SAVE_FILE_PATH_CITRA;
export const SAVE_FILE_LIME3 = SAVE_FILE_PATH_LIME;
export const MODS_FILE_LIME3 = MODS_FILE_PATH_LIME;

export function declareGlobalConfig(name, value) {
    globalConfigObject[name] = value;
}
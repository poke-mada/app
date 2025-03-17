import path from "path";
import {XY as SAVE_XY} from "@/api/save_editor/SaveData";
import {XY as RAM_XY} from "@/api/ram_editor/romData";
import {XY as RAM_XY2} from "@/api/ram_editor/RamData";

let BASE_URL;
const DEV = false;
if (DEV) {
    BASE_URL = 'http://localhost:8000';
} else {
    BASE_URL = 'https://pokemon.para-mada.com';
}

const SAVE_FILE_PATH = path.join(
    process.env.APPDATA, 'Citra', 'sdmc', 'Nintendo 3DS',
    '00000000000000000000000000000000', '00000000000000000000000000000000',
    'title', '00040000', '00055d00', 'data', '00000001', 'main'
);

let globalConfigObject = {}

export const GLOBAL_CONFIG = globalConfigObject;
export const SAVE_ROM = SAVE_XY;
export const RAM_ROM = RAM_XY;
export const RAM_ROM2 = RAM_XY2;
export const SERVER_URL = BASE_URL;
export const IS_DEV = DEV;
export const SAVE_FILE = SAVE_FILE_PATH;

export function declareGlobalConfig(name, value) {
    globalConfigObject[name] = value;
}
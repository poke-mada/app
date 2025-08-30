import path from "path";
import {XY as SAVE_XY} from "@/app/api/save_editor/SaveData";
import {XY as RAM_XY} from "@/app/api/ram_editor/romData";
import {XY as RAM_XY2} from "@/app/api/ram_editor/RamData";
import {EventEmitter} from "events";
import config from "@/app/api/lib/config";


let BASE_URL;
const DEV = true;
if (DEV) {
    BASE_URL = 'http://localhost:8000';
} else {
    BASE_URL = 'https://pokemon.para-mada.com';
}


const MODS_FILE_PATH_LIME = path.join(process.env.APPDATA, 'Lime3DS', 'load', 'mods', '0004000000055D00')
let _SAVE_FILE_LIME3 = config.get("savePath");
export function update_save_file() {
    _SAVE_FILE_LIME3 = config.get("savePath");
}


let globalConfigObject = {}

export const emmiter = new EventEmitter();
export const GLOBAL_CONFIG = globalConfigObject;
export const SAVE_ROM = SAVE_XY;
export const RAM_ROM = RAM_XY;
export const RAM_ROM2 = RAM_XY2;
export const SERVER_URL = BASE_URL;
export const IS_DEV = DEV;
export const SAVE_FILE_LIME3 = _SAVE_FILE_LIME3;
export const MODS_FILE_LIME3 = MODS_FILE_PATH_LIME;
export const APPDATA_FOLDER = path.join(process.env.APPDATA, 'dedsafio-pokemon');
export const TEST_CLIENT_PATH = path.join(APPDATA_FOLDER, 'play.pokemonshowdown.com', 'testclient.html')
export function declareGlobalConfig(name, value) {
    globalConfigObject[name] = value;
}
// src/background/config.js
import fs from 'fs';
import path from 'path';
import { app } from 'electron';

const configPath = path.join(app.getPath('userData'), 'config.json');

let configCache = null;

const DEFAULT_SAVE_PATH = path.join(
    process.env.APPDATA, 'Lime3DS', 'sdmc', 'Nintendo 3DS',
    '00000000000000000000000000000000', '00000000000000000000000000000000',
    'title', '00040000', '00055d00', 'data', '00000001', 'main'
);

const defaultConfig = {
    savePath: DEFAULT_SAVE_PATH.toString(),
    impostors: [],
    deaths: []
};

// Asegura que el archivo exista
function ensureConfigFile() {
    try {
        fs.accessSync(configPath);
    } catch {
        saveConfig(defaultConfig);
    }
}

// Cargar config del disco
export function loadConfig() {
    ensureConfigFile();
    if (configCache) return configCache;

    const raw = fs.readFileSync(configPath, 'utf-8');
    configCache = JSON.parse(raw);
    return configCache;
}

// Guardar config
export function saveConfig(data) {
    configCache = data;
    fs.writeFileSync(configPath, JSON.stringify(data, null, 2), 'utf-8');
}

// Accesos rápidos
export function get(key) {
    const config = loadConfig();
    return config[key];
}

export function set(key, value) {
    const config = loadConfig();
    config[key] = value;
    saveConfig(config);
}

export default {
    get: get,
    set: set
}
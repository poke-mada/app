import {app, ipcMain} from "electron";
import {session} from "@/stores/backend";
import path from "path";
import fs from "fs";
import {CitraClient} from "@/api/ram_editor/CitraClient";
import {GLOBAL_CONFIG} from "@/stores/back_constants";
import {autoUpdater} from "electron-updater";
import {compareVersions} from "compare-versions";
import {
    getOrCreatePokemonItem,
    modifyPokemonBattleData,
    modifyPokemonData,
    setPokemon
} from "@/api/ram_editor/RamAccesor";
import {addPokemonSaveData, clearPokemonSaveData, modifyPokemonSaveData} from "@/api/save_editor/SaveAccesor";
import {SavePokemon} from "@/api/save_editor/SavePokemon";
import {PokemonGame} from "@/api/handlers/PokemonGame";

function downloadSaveEvent(ipc, trainer_name) {
    session.get(`/last_save/${trainer_name}`, {
        responseType: 'arraybuffer'
    }).then((response) => {
        const save_path = path.join(process.env.HOMEDRIVE, process.env.HOMEPATH, "Downloads", trainer_name)
        const fileData = Buffer.from(response.data, 'binary');
        fs.writeFile(save_path, fileData, () => {
            GLOBAL_CONFIG.win.webContents.send('notify', {
                message: 'Archivo de guardado descargado con éxito!\r\na la carpeta de descargas'
            })
        })
    })
}

async function openMainChannel(ipc) {
    let game = new PokemonGame()
    if (!process.env.WEBPACK_DEV_SERVER_URL) {
        let new_version = null;
        autoUpdater.checkForUpdatesAndNotify().then((res) => {
            let is_updateVersion = compareVersions(autoUpdater.currentVersion.toString(), res.updateInfo.version.toString()) < 0;
            if (res && is_updateVersion) {
                new_version = res.updateInfo.version.toString();
                res.downloadPromise.then(() => {
                    app.quit();
                })
            }
        });

        autoUpdater.on('download-progress', (progress_object) => {
            GLOBAL_CONFIG.win.webContents.send('update-progress', {
                progress: progress_object.percent,
                version: new_version
            });
        });
    }
    await game.startComms(ipc);
}


async function inventoryModificationEvent(data) {
    let citra = new CitraClient();
    await getOrCreatePokemonItem(19, data.event_qty, true, citra)
}

async function pokemonModificationEvent(ipc, data) {
    const pokemonData = fs.readFileSync('E:\\pkhex\\pkmn\\charmeleon.ek6');
    if (data.level === 'ram') {
        const citra = new CitraClient();
        switch (data.effect) {
            case 'boosts':
                await modifyPokemonBattleData(data.slot, data.boosts, citra);
                break;
            case 'clean':
                await setPokemon(SavePokemon.getEmptySlot(), data.slot, citra)
                break;
            case 'edit':
                await modifyPokemonData(data.slot, data.new_data, citra)
                break;
            case 'add':
                //await addPokemonData(pokemonData, citra)
                break;
        }
    } else if (data.level === 'save') {
        switch (data.effect) {
            case 'clean':
                clearPokemonSaveData(data.slot)
                break;
            case 'edit':
                modifyPokemonSaveData(data.slot, data.new_data);
                break;
            case 'add':
            default:
                addPokemonSaveData(pokemonData)
                break;
        }
    }
}

export function registerEvents() {
    ipcMain.on('open_channel', openMainChannel);
    ipcMain.on('download_save', downloadSaveEvent);
    ipcMain.on('inv', inventoryModificationEvent);
    ipcMain.on('pkm', pokemonModificationEvent);
}
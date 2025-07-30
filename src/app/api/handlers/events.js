// noinspection JSUnresolvedVariable

import {ipcMain, Notification} from "electron";
import {session} from "@/stores/backend";
import path from "path";
import fs from "fs";
import {CitraClient} from "@/app/api/ram_editor/CitraClient";
import {declareGlobalConfig, emmiter, GLOBAL_CONFIG, MODS_FILE_LIME3, SERVER_URL} from "@/stores/back_constants";
import {autoUpdater} from "electron-updater";
import {compareVersions} from "compare-versions";
import {
    getOrCreatePokemonItem, giveMoneyToPlayer,
    modifyPokemonBattleData,
    modifyPokemonData,
    setPokemon
} from "@/app/api/ram_editor/RamAccesor";
import {
    addPokemonSaveData,
    clearPokemonSaveData,
    modifyPokemonSaveData,
    writeSaveBytes
} from "@/app/api/save_editor/SaveAccesor";
import {SavePokemon} from "@/app/api/save_editor/SavePokemon";
import {PokemonGame} from "@/app/api/handlers/PokemonGame";
import AdmZip from "adm-zip";
import axios from "axios";

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
        autoUpdater.setFeedURL({
            provider: 'generic',
            url: 'https://para-mada-deploy.s3.us-east-1.amazonaws.com/dedsafio/',
        });

        let new_version = null;
        autoUpdater.checkForUpdatesAndNotify().then((res) => {
            let is_updateVersion = compareVersions(autoUpdater.currentVersion.toString(), res.updateInfo.version.toString()) < 0;
            if (res && is_updateVersion) {
                new_version = res.updateInfo.version.toString();
                res.downloadPromise.then(() => {
                    autoUpdater.quitAndInstall(true, true);
                })
            }
        });

        autoUpdater.on('download-progress', (progress_object) => {
            GLOBAL_CONFIG.window.webContents.send('update-progress', {
                progress: progress_object.percent,
                version: new_version
            });
        });
    }

    emmiter.removeAllListeners('perform_save')
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

function storeFrontData(ipc, data) {
    for (const [key, value] of Object.entries(data)) {
        declareGlobalConfig(key, value);
    }
}

async function exchangeRewardBundle(ipc, data) {
    const bundle_id = data.bundle_id;
    const token = data.token;


    const response = await session.post(`/api/trainers/claim_reward/${bundle_id}/`, null, {
        headers: {
            Authorization: `Token ${token}`
        }
    }).catch((reason) => {
        ipc.reply('notification', {
            title: '¡Un Error Ha Ocurrido!',
            message: 'ha ocurrido un error, contacta a soporte (para_mada)',
            details: JSON.stringify(reason)
        })
        ipc.reply('perform_save')
    });
    if (response.status === 200) {
        const rewards = response.data.rewards;
        ipc.reply('show_save_dialog')
        const itemRewards = rewards.filter(i => i.reward_type === 0);
        const nonItemRewards = rewards.filter(i => i.reward_type !== 0);
        const citra = new CitraClient();

        for (const reward of itemRewards) {
            getOrCreatePokemonItem(reward.bag, reward.item, reward.quantity, true, citra).then(() => {
                console.log(`Added x${reward.quantity} ${reward.item} to ${reward.bag}`)
            });
        }

        emmiter.on('perform_save', async () => {
            let newData;
            let needsRestart = false;
            emmiter.removeAllListeners('perform_save')
            for (const reward of nonItemRewards) {
                if (reward.reward_type === 3) {// pokemon
                    const pokemonData = Buffer.from(reward.pokemon_data);
                    // eslint-disable-next-line no-unused-vars
                    newData = addPokemonSaveData(pokemonData, true);
                    needsRestart = true;
                }
            }
            writeSaveBytes(newData);
            ipc.reply('perform_save');
            if (needsRestart) {
                ipc.reply('notification', {
                    title: '¡Reinicia Tu Partida!',
                    message: 'Los cambios se han efectuado, puedes reiniciar tu partida (no olvides dar F5 a la app luego de iniciar partida)',
                    persistent: true
                })
            }
        })
    }

}

function extractZip(zipFilePath, destinationPath) {
    const zip = new AdmZip(zipFilePath);

    zip.extractAllTo(destinationPath, true);
}

async function joinEvent(ipc, data) {
    const event_id = data.event_id;
    const https = require("https");

    const zipfile = fs.createWriteStream('mod_zip.zip');
    const event_response = await axios.get(`${SERVER_URL}/api/events/${event_id}/mod_file/`)
    const s3_url = event_response.data;
    console.log(s3_url)
    https.get(s3_url,(response) => {
        const total = parseInt(response.headers["content-length"], 10);
        let received = 0;
        response.on("data", (chunk) => {
            received += chunk.length;
            const percent = Math.round((received / total) * 100);
            ipc.reply("download-progress", percent);
        });
        response.pipe(zipfile);
        zipfile.on("finish", () => {
            zipfile.close();
            try {
                extractZip('mod_zip.zip', MODS_FILE_LIME3)
                ipc.reply("download-stop");
                ipc.reply('notification', {
                    title: '¡Reinicia Tu Partida!',
                    message: 'Los cambios se han efectuado, puedes reiniciar tu partida (no olvides dar F5 a la app luego de iniciar partida)',
                    persistent: true
                })
            } catch (e) {
                console.log(e)
            }
        });
    });

}

async function leaveEvent(ipc) {

    try {
        const items = fs.readdirSync(MODS_FILE_LIME3, {withFileTypes: true});

        for (const item of items) {
            if (item.isDirectory()) {
                const rutaCompleta = path.join(MODS_FILE_LIME3, item.name);
                await fs.rm(rutaCompleta, {recursive: true, force: true});
                console.log(`Carpeta eliminada: ${rutaCompleta}`);
            }
        }
    } catch (err) {
        console.error('Error al borrar carpetas:', err);
    }

    ipc.reply('notification', {
        title: '¡Reinicia Tu Partida!',
        message: 'Los cambios se han efectuado, puedes reiniciar tu partida (no olvides dar F5 a la app luego de iniciar partida)',
        persistent: true
    })
}

async function manageWildcardEvents(ipc, command_data) {
    const citra = new CitraClient();
    if (command_data) {
        const reward = command_data.data
        switch (command_data.command) {
            case 'give_item':
                await getOrCreatePokemonItem(reward.item_bag, reward.item_id, reward.quantity, true, citra);
                console.log(`Added x${reward.item_reward.quantity} ${reward.item_reward.item} to ${reward.item_reward.bag} by wildcard`);
                break;
            case 'give_money':
                await giveMoneyToPlayer(reward.quantity, citra);
                console.log(`Added ¥${reward.quantity} to the game by wildcard`);
                break;
        }
    }
    citra.close()
}

function showNotification(ipc, data) {
    if (data) {
        const notification = new Notification({
            title: data.title,
            body: data.message,
            silent: true,
            icon: './public/icons/icon.ico'
        });

        notification.on('click', () => {
            console.log('Notificación clickeada');
        });
        notification.show();
    }
}

export function registerEvents() {
    ipcMain.on('open_channel', openMainChannel);
    ipcMain.on('download_save', downloadSaveEvent);
    ipcMain.on('event', joinEvent);
    ipcMain.on('leave_event', leaveEvent);
    ipcMain.on('store', storeFrontData);
    ipcMain.on('reward', exchangeRewardBundle);
    ipcMain.on('wildcard', manageWildcardEvents);
    ipcMain.on('notify', showNotification);
}
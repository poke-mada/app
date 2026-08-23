// noinspection JSUnresolvedVariable

import {BrowserWindow, ipcMain, Notification, session as el_session, dialog, shell} from "electron";
import {session} from "@/stores/backend";
import path from "path";
import fs from "fs";
import {CitraClient} from "@/app/api/ram_editor/CitraClient";
import {
    APPDATA_FOLDER,
    declareGlobalConfig,
    emmiter,
    GLOBAL_CONFIG,
    MODS_FILE_LIME3, RAM_ROM2 as rom2, SAVE_FILE_LIME3,
    SERVER_URL, TEST_CLIENT_PATH, update_save_file
} from "@/stores/back_constants";
import {autoUpdater} from "electron-updater";
import {compareVersions} from "compare-versions";
import {
    getBagAddress, getBagLength,
    getOrCreatePokemonItem, giveMoneyToPlayer, readPokemonBag,
} from "@/app/api/ram_editor/RamAccesor";
import {
    addPokemonSaveData,
    writeSaveBytes
} from "@/app/api/save_editor/SaveAccesor";
import {PokemonGame} from "@/app/api/handlers/PokemonGame";
import AdmZip from "adm-zip";
import axios from "axios";
import https from "https";
import config from "@/app/api/lib/config";


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

async function downloadShowdownClient(ipc) {
    console.log('[SHOWDOWN-APP] started showdown download process')
    let showdownClientDownloaded = config.get('showdown-client-downloaded', false)
    if (!showdownClientDownloaded) {
        console.log('[SHOWDOWN-APP] showdown download allowed')
        const zip_file_path = path.join(APPDATA_FOLDER, 'showdown-client.zip');
        const zipfile = fs.createWriteStream(zip_file_path);

        const lambda_response = await axios.get('https://5j5zxvz74jvbztrrhh6wjt2iji0apnuz.lambda-url.us-east-1.on.aws/');

        const s3_url = lambda_response.data;

        https.get(s3_url, (response) => {
            response.on("data", (chunk) => {
                console.log('[SHOWDOWN-APP] downloading showdown client...')
            });
            response.pipe(zipfile);
            zipfile.on("finish", () => {
                zipfile.close();
                try {
                    ipc.reply('enable-showdown-module')
                    extractZip(zip_file_path, APPDATA_FOLDER)
                    console.log('[SHOWDOWN-APP] showdown client downloaded!')
                    config.set('showdown-client-downloaded', true)
                } catch (e) {
                    console.log(e)
                }
            });
        });
    } else {
        ipc.reply('enable-showdown-module')
        console.log('[SHOWDOWN-APP] showdown client already downloaded!')
    }
}

async function openMainChannel(ipc) {
    let game = new PokemonGame()
    if (!process.env.WEBPACK_DEV_SERVER_URL) {
        autoUpdater.setFeedURL({
            provider: 'generic',
            url: 'https://para-mada-deploy.s3-accelerate.amazonaws.com/dedsafio/',
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
    await downloadShowdownClient(ipc);

    emmiter.removeAllListeners('perform_save')
    await game.startComms(ipc);
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
        console.log(reason)
        ipc.reply('perform_save')
    });
    if (response.status === 200) {
        const rewards = response.data.rewards;
        const itemRewards = rewards.filter(i => i.reward_type === 0);
        const pokemonRewards = rewards.filter(i => i.reward_type === 3);
        if (itemRewards.length > 0) {
            const citra = new CitraClient();
            ipc.reply('show_save_dialog')
            for (const reward of itemRewards) {
                getOrCreatePokemonItem(reward.bag, reward.item, reward.quantity, true, citra).then(() => {
                    console.log(`Added x${reward.quantity} ${reward.item} to ${reward.bag}`)
                });
            }
            emmiter.on('perform_save', async () => {
                ipc.reply('perform_save');
                emmiter.removeAllListeners('perform_save')
            })
        }
        if (pokemonRewards.length > 0) {
            ipc.reply('show_save_dialog')
            emmiter.on('perform_save', async () => {
                let newData;
                emmiter.removeAllListeners('perform_save');

                for (const reward of pokemonRewards) {
                    const pokemonData = Buffer.from(reward.pokemon_data);
                    // eslint-disable-next-line no-unused-vars
                    newData = addPokemonSaveData(pokemonData, true);
                }
                writeSaveBytes(newData);
                ipc.reply('perform_save');
                ipc.reply('notification', {
                    title: '¡Reinicia Tu Partida!',
                    message: 'Los cambios se han efectuado, puedes reiniciar tu partida (no olvides dar F5 a la app luego de iniciar partida)',
                    persistent: true
                });
            })
        }

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
    const event_response = await axios.get(`${SERVER_URL}/api/events/${event_id}/mod_file/`, {
        headers: {
            Authorization: `Token ${data.token}`
        }
    })
    const s3_url = event_response.data;
    https.get(s3_url, (response) => {
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
                ipc.reply("event-joined");
                ipc.reply('notification', {
                    title: '¡Reinicia Tu Partida!',
                    message: 'Los cambios se han efectuado, puedes reiniciar tu partida (no olvides dar F5 a la app luego de iniciar partida)',
                    persistent: true
                })
            } catch (e) {
                ipc.reply('notification', {
                    title: '¡Un Error Ha Ocurrido!',
                    message: 'ha ocurrido un error, contacta a soporte (para_mada)',
                    details: JSON.stringify(e)
                })
            } finally {
                ipc.reply("download-stop");
            }
        });
    });

}

async function leaveEvent(ipc, data) {
    const event_id = data.event_id;
    const token = data.token_id;

    await session.post(`/api/events/${event_id}/leave/`, null, {
        headers: {
            Authorization: `Token ${token}`
        }
    })
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
    ipc.reply('event-left');
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

async function fetchSidFromDRF(data) {
    const token = data.token;
    const response = await session.get('/api/trainers/showdown_key/', {
        headers: {
            Authorization: `Token ${token}`
        }
    })
    return response.data
}

async function openShowdownClient(ipc, data, opts = {}) {
    const {
        width = 1200,
        height = 800,
        passKeyVia = 'query', // 'cookie' (recomendado) | 'query' | 'configjs'
    } = opts
    const part = `persist:ps-client-${Date.now()}`
    const ses = el_session.fromPartition(part, {cache: true})
    const win = new BrowserWindow({
        width,
        height,
        autoHideMenuBar: true,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            devTools: false,       // en prod quedará false
            sandbox: true,
            preload: path.join(__dirname, 'preload-client.js'), // si lo necesitas
            session: ses,
        }
    });
    console.log('abriendo cliente de showdown...')

    const SID = await fetchSidFromDRF(data);
    const baseUrl = 'file://' + TEST_CLIENT_PATH.replace(/\\/g, '/')
    const url = passKeyVia === 'query'
        ? `${baseUrl}?~~158.69.213.100:8000&client_key=${encodeURIComponent(SID)}`
        : baseUrl
    await win.loadURL(url)
}

function requestSavePath(ipc) {
    ipc.reply('save-path-data', SAVE_FILE_LIME3)
}

function updateSavePath(ipc, data) {
    config.set('savePath', data);
    update_save_file();
    ipc.reply('save-path-data', data);
}

function openLink(ipc, data) {
    shell.openExternal(data);
}

async function requestItemsHandler() {
    const item_bag_items = await readPokemonBag('items')
    const meds_bag_items = await readPokemonBag('meds')
    const berry_bag_items = await readPokemonBag('berries')

    return item_bag_items.concat(meds_bag_items).concat(berry_bag_items);
}

async function manageMarketTransactions(ipc, raw_data) {
    const data = JSON.parse(raw_data);
    const api_token = data.token;
    const serializedItems = data.items;

    for (const item of serializedItems) {
        await getOrCreatePokemonItem(item.bag, item.index, -item.quantity, true)
    }
    ipc.reply('show_save_dialog')
    emmiter.on('perform_save', async () => {
        ipc.reply('perform_save');
        ipc.reply('update_market');

        session.post('/api/market/transfer_items/', {
            items: JSON.stringify(data.items)
        }, {
            headers: {
                Authorization: `Token ${api_token}`
            }
        }).catch((reason) => {
            for (const item of serializedItems) {
                getOrCreatePokemonItem(item.bag, item.index, item.quantity, true)
            }
            ipc.reply('notification', {
                title: '¡Un Error Ha Ocurrido!',
                message: 'ha ocurrido un error, contacta a soporte (para_mada)',
                details: JSON.stringify(reason)
            })
            console.log(reason)
            ipc.reply('perform_save')
        });
        emmiter.removeAllListeners('perform_save')
    })
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
    ipcMain.on('open-showdown', openShowdownClient);

    ipcMain.on('request-save-path', requestSavePath);
    ipcMain.on('update-save-path', updateSavePath);
    ipcMain.on('open-link', openLink);

    ipcMain.handle('open-file-dialog', async () => {
        const result = await dialog.showOpenDialog({properties: ["openFile"]});
        return result.filePaths;
    });
    ipcMain.handle('request-items', requestItemsHandler)
    ipcMain.on('push_item_to_market', manageMarketTransactions)
}
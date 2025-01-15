'use strict'

import {compareVersions} from 'compare-versions';
import {app, BrowserWindow, dialog, ipcMain, nativeImage, protocol} from 'electron'
import {createProtocol} from 'vue-cli-plugin-electron-builder/lib'
import installExtension, {VUEJS3_DEVTOOLS} from 'electron-devtools-installer'
import {autoUpdater} from "electron-updater"
import {XY} from "@/api/romData";
import path from "path";
import fs from "fs";

import config from 'config'
import toml from 'toml'
import TOML from '@iarna/toml'
import {PokemonGame} from "./api/PokemonGame";
import {session} from "@/store";

function loadTomlConfig(win) {
    const tomlFilePath = 'config/config.toml'; // Ruta a tu archivo TOML
    if (!fs.existsSync(tomlFilePath)) {
        let save_file = dialog.showOpenDialogSync(win, {
            title: 'Selecciona tu archivo de guardado',
            icon: nativeImage.createFromPath('./public/icon.png'),
            properties: ['openFile'],
            message: 'Archivos de guardado',
            defaultPath: path.join(process.env.APPDATA, '\\Citra\\sdmc\\Nintendo 3DS\\00000000000000000000000000000000\\00000000000000000000000000000000\\title\\00040000\\00055e00\\data\\00000001')
        });
        let data = {
            app: {
                save_file: save_file[0]
            }
        }
        const stringed = TOML.stringify(data);
        fs.mkdirSync('config')
        fs.writeFile(tomlFilePath, stringed, console.log)
        return toml.parse(stringed); // Parseamos el contenido TOML
    } else {
        const tomlContent = fs.readFileSync(tomlFilePath, 'utf-8');
        return toml.parse(tomlContent); // Parseamos el contenido TOML
    }
}


const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    {scheme: 'app', privileges: {secure: true, standard: true}}
])

async function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 1200,
        height: 873,
        icon: './public/icons/icon.png',
        title: `Poke Mada v${autoUpdater.currentVersion}`,
        autoHideMenuBar: true,
        webPreferences: {
            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
            contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        //if (!process.env.IS_TEST) win.webContents.openDevTools()
    } else {
        let new_version = null;
        createProtocol('app')
        // Load the index.html when not in development
        await win.loadURL('app://./index.html')
    }
    return win
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    let win = await createWindow();
    const tomlConfig = loadTomlConfig(win);
    config.util.extendDeep(config, tomlConfig);
    let SAVE_FILE_PATH = config.get("app.save_file");

    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installExtension(VUEJS3_DEVTOOLS)
        } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString())
        }
    }


    let game = new PokemonGame(XY);
    ipcMain.on('open_channel', (ipc) => {
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
                win.webContents.send('update-progress', {
                    progress: progress_object.percent,
                    version: new_version
                });
            });
        }
        game.stop();
        game.startComms(ipc, SAVE_FILE_PATH);
    });

    ipcMain.on('download_save', (ipc, trainer_name) => {
        session.get(`/saves/${trainer_name}`).then((response) => {
            const downloadFolder = process.env.USERPROFILE + "/Downloads";
            fs.writeFileSync(downloadFolder + '/' + trainer_name, response.data)
        })
    })

    win.reload();
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}

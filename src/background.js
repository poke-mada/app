import {app, BrowserWindow, protocol} from 'electron'
import {createProtocol} from 'vue-cli-plugin-electron-builder/lib'
import installExtension, {VUEJS3_DEVTOOLS} from 'electron-devtools-installer'
import {autoUpdater} from "electron-updater";
import path from "path";

import {declareGlobalConfig} from "@/stores/back_constants";
import {registerEvents} from "@/app/api/handlers/events";


const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    {scheme: 'app', privileges: {secure: true, standard: true}}
])


async function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 1600,
        height: 873,
        minWidth: 1600,
        icon: './public/icons/icon.ico',
        title: `Dedsafio Pokemon v${autoUpdater.currentVersion}`,
        autoHideMenuBar: true,
        webPreferences: {
            // devTools: false,
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
            contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    } else {
        createProtocol('app')
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



app.on('activate', async () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) await createWindow()
})
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    if (process.platform === 'win32')
    {
        app.setAppUserModelId("DEDsafío Pokémon");
    }
    let win = await createWindow();
    declareGlobalConfig('window', win);
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installExtension(VUEJS3_DEVTOOLS)
        } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString())
        }
    }

    registerEvents();
    win.reload();
})

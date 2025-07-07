import {app, BrowserWindow, protocol, Menu, Tray} from 'electron'
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
        width: 1200,
        height: 873,
        icon: './public/icons/icon.ico',
        title: `Dedsafio Pokemon v${autoUpdater.currentVersion}`,
        autoHideMenuBar: true,
        webPreferences: {
            // devTools: false,
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



app.on('activate', async () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) await createWindow()
})
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
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

    function createTray() {
        let appIcon = new Tray("./public/icons/icon.ico");
        const contextMenu = Menu.buildFromTemplate([
            {
                label: 'Show', click: function () {
                    win.show();
                }
            },
            {
                label: 'Exit', click: function () {
                    app.isQuiting = true;
                    app.quit();
                    appIcon.destroy();
                }
            }
        ]);

        appIcon.on('click', function (event) {
            win.show();
        });
        appIcon.setToolTip('Dedsafio Pokémon');
        appIcon.setContextMenu(contextMenu);
        return appIcon;
    }
    createTray();

    win.on('close', function (event) {
        if (!app.isQuiting) {
            event.preventDefault();
            win.hide();
        }
        return false;
    });

    win.on('restore', function (event) {
        win.show();
    });

    registerEvents();
    win.reload();
})

import { app, BrowserWindow, protocol, globalShortcut } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
import { autoUpdater } from 'electron-updater'
import path from 'path'

import { declareGlobalConfig } from '@/stores/back_constants'
import { registerEvents } from '@/app/api/handlers/events'

const isDevelopment = process.env.NODE_ENV !== 'production'
const DEV_MODE =
  isDevelopment ||
  String(process.env.DEV_MODE) === 'true' ||
  !!process.env.WEBPACK_DEV_SERVER_URL

const NODE_INTEGRATION = String(process.env.ELECTRON_NODE_INTEGRATION) === 'true'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow () {
  const win = new BrowserWindow({
    width: 1600,
    height: 873,
    minWidth: 1600,
    icon: './public/icons/icon.ico',
    title: `Dedsafio Pokemon v${autoUpdater.currentVersion}`,
    autoHideMenuBar: true,
    webPreferences: {
      devTools: false, // forzado a true; el gating lo hacemos con DEV_MODE al abrir
      nodeIntegration: NODE_INTEGRATION,
      contextIsolation: !NODE_INTEGRATION,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
  } else {
    createProtocol('app')
    await win.loadURL('app://./index.html')
  }

  if (DEV_MODE) {
    win.once('ready-to-show', () => {
      if (!win.webContents.isDevToolsOpened()) {
        win.webContents.openDevTools({ mode: 'detach' })
      }
    })
  }

  return win
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', async () => {
  if (BrowserWindow.getAllWindows().length === 0) await createWindow()
})

app.on('ready', async () => {
  if (process.platform === 'win32') {
    app.setAppUserModelId('DEDsafío Pokémon')
  }

  const win = await createWindow()
  declareGlobalConfig('window', win)

  if (DEV_MODE && !process.env.IS_TEST) {
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }

  registerEvents()

  // Atajo F12 para abrir/cerrar DevTools
  globalShortcut.register('F12', () => {
    const w = BrowserWindow.getFocusedWindow() || win
    if (!w) return
    if (w.webContents.isDevToolsOpened()) w.webContents.closeDevTools()
    else w.webContents.openDevTools({ mode: 'detach' })
  })
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

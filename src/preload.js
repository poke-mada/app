const { contextBridge, ipcRenderer } = require('electron');

ipcRenderer.setMaxListeners(15)
contextBridge.exposeInMainWorld('electron', {
    // eslint-disable-next-line no-undef
    getStatic: (...directory) => [__static, directory.join('/')].join('/'),

    startComms: () => ipcRenderer.send('open_channel'),
    onDataReceived: (channel, callback) => ipcRenderer.on(channel, callback)
});

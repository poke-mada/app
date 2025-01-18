const { contextBridge, ipcRenderer } = require('electron');

ipcRenderer.setMaxListeners(15)
contextBridge.exposeInMainWorld('electron', {
    // eslint-disable-next-line no-undef
    getStatic: (...directory) => [__static, directory.join('/')].join('/'),

    startComms: () => ipcRenderer.send('open_channel'),
    downloadSave: (trainer_name) => ipcRenderer.send('download_save', trainer_name),
    onDataReceived: (channel, callback) => ipcRenderer.on(channel, callback),
    sendMessage: (channel, callback) => ipcRenderer.send(channel, callback)
});

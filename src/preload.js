const { contextBridge, ipcRenderer } = require('electron');

ipcRenderer.setMaxListeners(15)
// Exponer algunas funciones del sistema de archivos y el módulo path de manera controlada
contextBridge.exposeInMainWorld('electron', {

    // Función para obtener el directorio de la aplicación usando path
    getStatic: (...directory) => {
        // eslint-disable-next-line no-undef
        return [__static, directory.join('/')].join('/');
    },

    // Usar IPC para enviar y recibir datos
    startComms: () => ipcRenderer.send('open_channel'),
    onDataReceived: (channel, callback) => ipcRenderer.on(channel, callback)
});

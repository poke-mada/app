import fs from 'fs'
import axios from 'axios'

import os from 'os'

import FormData from 'form-data';

export const watchSave = function (HOST_URL, FILE_NAME) {
    if (!fs.existsSync(FILE_NAME)) {
        console.log(FILE_NAME)
        console.log('file cannot be read')
        return;
    }
    fs.watchFile(FILE_NAME, {
        bigint: true,
        persistent: false,
        interval: 2000
    }, () => {
        const formData = new FormData();
        formData.append('file', fs.createReadStream(FILE_NAME), {
            filename: os.userInfo().username
        });
        axios.post(`http://${HOST_URL}/uploadfile/`, formData, {
            headers: {
                ...formData.getHeaders(),  // Añade los encabezados necesarios para multipart/form-data
            },
        }).then(() => console.log('succeeded')).catch(() => console.error('failed'))
    })
}
export const stopWatching = function (FILE_NAME) {
    try {
        fs.unwatchFile(FILE_NAME)
    } catch (e) {

        console.log('file not read')
    }
}
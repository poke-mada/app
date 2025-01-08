import dgram from 'dgram';
import crypto from 'crypto';
import struct from 'python-struct';


const CITRA_PORT = 45987;  // El puerto en el que se escucha y se envía


let CURRENT_REQUEST_VERSION = 1
let MAX_REQUEST_DATA_SIZE = 32

//let MAX_PACKET_SIZE = 48

class CitraClient {
    constructor() {
        this.socket = dgram.createSocket('udp4');  // Crear un socket UDP v4
    }

    _generateHeader(requestType, dataSize) {
        // Generar un ID de solicitud aleatorio de 32 bits
        const requestId = crypto.randomBytes(4).readUInt32BE(0);  // Lee 4 bytes y lo convierte en un entero de 32 bits

        // Empaquetar el encabezado en formato binario
        const headerBuffer = struct.pack('IIII', CURRENT_REQUEST_VERSION, requestId, requestType, dataSize);

        // Devolver el encabezado y el ID de la solicitud
        return [headerBuffer, requestId];
    }

    _readAndValidateHeader(rawReply, expectedId, expectedType) {
        // Desempaquetar los primeros 16 bytes de la respuesta para obtener el encabezado
        const [replyVersion, replyId, replyType, replyDataSize] = struct.unpack('IIII', rawReply.slice(0, 16));

        // Validar los datos del encabezado
        if (CURRENT_REQUEST_VERSION === replyVersion &&
            expectedId === replyId &&
            expectedType === replyType &&
            replyDataSize === rawReply.length - 16) {
            // Si es válido, devolver los datos después del encabezado
            return rawReply.slice(16);  // Los datos empiezan después de los 16 bytes del encabezado
        }
        return null;  // Si no es válido, retornar null
    }


    async readMemory(readAddress, readSize) {
        let result = Buffer.alloc(0);  // Inicializar el resultado como un Buffer vacío

        while (readSize > 0) {
            const tempReadSize = Math.min(readSize, MAX_REQUEST_DATA_SIZE);
            const requestData = struct.pack('II', readAddress, tempReadSize);  // Empaquetar la solicitud

            const [header, requestId] = this._generateHeader(1, requestData.length);  // 1 es el tipo de solicitud para ReadMemory
            const finalRequest = Buffer.concat([header, requestData]);
            // Enviar la solicitud
            this.socket.send(finalRequest, CITRA_PORT, (err) => {
                if (err) {
                    console.error('Game not running')
                }
            });
            let replyData = await this._waitForReply(requestId).catch(() => {
                this.socket.close()
            });
            if (replyData) {
                result = Buffer.concat([result, replyData]);  // Agregar los datos recibidos al resultado
                readSize -= replyData.length;
                readAddress += replyData.length;
            }
        }
        return result;
    }

    async _waitForReply(requestId) {
        return new Promise((resolve, reject) => {
            let listener = (msg) => {
                const replyData = this._readAndValidateHeader(msg, requestId, 1);  // 1 = ReadMemory, 2 = WriteMemory
                if (replyData) {
                    resolve(replyData);
                }
            }
            this.socket.once('message', listener);
            setTimeout(() => {
                reject(new Error('Timeout esperando respuesta'));
            }, 5000); // Timeout de 5 segundos, ajustable según sea necesario
        });
    }
}

export {
    CitraClient
}
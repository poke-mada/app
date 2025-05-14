import dgram from 'dgram';
import crypto from 'crypto';


const CITRA_PORT = 45987;  // El puerto en el que se escucha y se envía

const RequestType = {
    ReadMemory: 1,
    WriteMemory: 2,
};

let CURRENT_REQUEST_VERSION = 1
let MAX_REQUEST_DATA_SIZE = 32

//let MAX_PACKET_SIZE = 48

class CitraClient {
    constructor(address = 'localhost', port = CITRA_PORT) {
        this.connected = false;
        this.socket = dgram.createSocket('udp4');  // Crear un socket UDP v4
        this.port = port;
        this.address = address;
    }

    _generateHeader(requestType, dataSize) {
        // Generar un ID de solicitud aleatorio de 32 bits
        const requestId = crypto.randomBytes(4).readUInt32BE(0);  // Lee 4 bytes y lo convierte en un entero de 32 bits

        // Empaquetar el encabezado en formato binario
        const headerBuffer = Buffer.alloc(16);
        headerBuffer.writeUInt32LE(CURRENT_REQUEST_VERSION, 0);
        headerBuffer.writeUInt32LE(requestId, 4);
        headerBuffer.writeUInt32LE(requestType, 8);
        headerBuffer.writeUInt32LE(dataSize, 12);

        // Devolver el encabezado y el ID de la solicitud
        return [headerBuffer, requestId];
    }

    _readAndValidateHeader(rawReply, expectedId, expectedType) {
        // Desempaquetar los primeros 16 bytes de la respuesta para obtener el encabezado
        const replyVersion = rawReply.readUInt32LE(0);
        const replyId = rawReply.readUInt32LE(4);
        const replyType = rawReply.readUInt32LE(8);
        const replyDataSize = rawReply.readUInt32LE(12);
        const replyData = rawReply.slice(16);

        // Validar los datos del encabezado
        if (CURRENT_REQUEST_VERSION === replyVersion &&
            expectedId === replyId &&
            expectedType === replyType &&
            replyDataSize === rawReply.length - 16) {
            // Si es válido, devolver los datos después del encabezado
            return replyData;  // Los datos empiezan después de los 16 bytes del encabezado
        }
        return null;  // Si no es válido, retornar null
    }

    clearQueue() {
        this.socket.removeAllListeners('message');
    }

    close() {
        try {
            this.socket.removeAllListeners('message');
            this.socket.close();
            // eslint-disable-next-line no-empty
        } catch (e) {
        }
    }

    async test() {
        try {
            await this.readMemory(0, 1);
            return true;
        } catch (e) {
            console.log(e)
            return false;
        }
    }

    async readMemory(readAddress, readSize) {
        let result = Buffer.alloc(0);  // Inicializar el resultado como un Buffer vacío
        let mutableReadAddress = readAddress;
        let mutableReadSize = readSize;
        try {
            while (mutableReadSize > 0) {
                const tempReadSize = Math.min(mutableReadSize, MAX_REQUEST_DATA_SIZE);
                const requestData = Buffer.alloc(8);
                requestData.writeUInt32LE(mutableReadAddress, 0);
                requestData.writeUInt32LE(tempReadSize, 4);

                const [header, requestId] = this._generateHeader(RequestType.ReadMemory, requestData.length);
                const finalRequest = Buffer.concat([header, requestData]);
                // Enviar la solicitud
                this.socket.send(finalRequest, this.port, (error) => {
                    if (error) {
                        console.log(error)
                        this.connected = false;
                    }
                });
                let replyData = await this._waitForReply(requestId);

                if (replyData) {
                    result = Buffer.concat([result, replyData]);  // Agregar los datos recibidos al resultado
                    mutableReadSize -= replyData.length;
                    mutableReadAddress += replyData.length;
                }
            }
        } catch(e) {
            console.log(readAddress, readSize)
            throw e;
        } finally {
            this.socket.removeAllListeners('message')
        }
        return result;
    }

    async writeMemory(writeAddress, writeContents) {
        let writeSize = writeContents.length;
        while (writeSize > 0) {
            const tempWriteSize = Math.min(writeSize, MAX_REQUEST_DATA_SIZE - 8);
            const requestData = Buffer.alloc(8 + tempWriteSize);
            requestData.writeUInt32LE(writeAddress, 0);
            requestData.writeUInt32LE(tempWriteSize, 4);
            writeContents.copy(requestData, 8, 0, tempWriteSize);
            const [header, requestId] = this._generateHeader(RequestType.WriteMemory, requestData.length);
            const request = Buffer.concat([header, requestData]);

            await new Promise((resolve, reject) => {
                this.socket.send(request, this.port, this.address, (error) => {
                    if (error) {
                        reject(error);
                        this.connected = false;
                    }
                });
                this.socket.once('message', (rawReply) => {
                    const replyData = this._readAndValidateHeader(rawReply, requestId, RequestType.WriteMemory);
                    if (replyData !== null) {
                        writeAddress += tempWriteSize;
                        writeSize -= tempWriteSize;
                        writeContents = writeContents.slice(tempWriteSize);
                        resolve();
                    } else {
                        reject(new Error('Write failed'));
                    }
                });
            });
        }
        this.socket.removeAllListeners('message')
        return true;
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
            }, 3000); // Timeout de 5 segundos, ajustable según sea necesario
        });
    }

}

export {
    CitraClient
}
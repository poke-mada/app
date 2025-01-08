function clientSend(client, data) {
    let clean_data = data;
    if (data instanceof Object) {
        clean_data = JSON.stringify(data);
    }
    client.send(clean_data)
}

export {
    clientSend
}
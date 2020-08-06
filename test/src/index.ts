import Server from './classes/Server';

async function main(): Promise<void> {
    const slave = new Server({ port: 2000 });
    await slave.open();
    slave.connectMaster('http://localhost:1000');
    slave.masterSocket.on('connect', (): void => {
        console.log(`[${new Date().toISOString()}] success connect to master server`);
    });

    const slave_2 = new Server();
    slave_2.connectMaster('http://localhost:1000');
    slave_2.masterSocket.on('connect', (): void => {
        console.log(`[${new Date().toISOString()}] success connect to master server`);
    });

    const connectionServer = new Server({ port: 1000 });
    await connectionServer.open();
    connectionServer.socketServer.on('connection', (socket): void => {
        const remoteAddress = socket.conn.remoteAddress.replace(/::ffff:/g, '');
        console.log(`[${new Date().toISOString()}] slave server[${remoteAddress}] connected`);
    });
}

main();
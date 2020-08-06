import ServerManager from './classes/ServerManager';

async function main(): Promise<void> {
    const slave = new ServerManager({ port: 2000 });
    await slave.openServer();
    slave.connectMaster('http://localhost:1000');
    slave.masterSocket.on('connect', (): void => {
        console.log('connected master server');
    });

    const master = new ServerManager({ port: 1000 });
    await master.openServer();
    master.socketServer.on('connection', (socket): void => {
        console.log('something socket is connected');
    });
}

main();
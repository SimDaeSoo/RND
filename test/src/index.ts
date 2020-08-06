import Server from './classes/Server';

async function main(): Promise<void> {
    const slave = new Server({ port: 2000 });
    await slave.open();
    slave.connectMaster('http://localhost:1000');
    slave.masterSocket.on('connect', (): void => {
        console.log('connected master server');
    });

    const master = new Server({ port: 1000 });
    await master.open();
    master.socketServer.on('connection', (socket): void => {
        console.log('something socket is connected');
    });
}

main();
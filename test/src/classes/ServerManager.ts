import * as createExpress from 'express';
import * as SocketIO from 'socket.io';
import * as SocketIOClient from 'socket.io-client';
import * as Http from 'http';
import { Express } from 'express';

type Error = globalThis.Error;
type ServerOptions = { port?: number }

class ServerManager {
    private express: Express = createExpress();
    private httpServer!: Http.Server;
    public socketServer!: SocketIO.Server;
    public masterSocket!: SocketIOClient.Socket;
    public port: number;

    constructor(options?: ServerOptions) {
        this.port = options.port || 0;
    }

    public async openServer(): Promise<void> {
        return new Promise((resolve, reject): void => {
            this.httpServer = this.express.listen(this.port);

            this.httpServer.once('error', (err: Error): void => {
                this.closeServer();
                setTimeout(() => this.openServer(), 1000);
                reject();
            });

            this.httpServer.once('listening', (): void => {
                console.log(`[${new Date().toISOString()}] server opened`);
                try {
                    this.socketServer = SocketIO(this.httpServer, { serveClient: false });
                    resolve();
                } catch (error) {
                    console.log(error);
                    reject();
                }
            });
        });
    }

    public closeServer(): void {
        console.log(`[${new Date().toISOString()}] server closed`);
        this.disconnectMaster();
        this.httpServer.close();
    }

    public connectMaster(url: string): void {
        this.masterSocket = SocketIOClient(url);
    }

    public disconnectMaster(): void {
        this.masterSocket?.disconnect();
    }
}



export default ServerManager;
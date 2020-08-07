import * as SocketIOClient from 'socket.io-client';
import { COLOR, ClientOptions } from '../interfaces';

class Client {
    public connectionAddress!: string;
    public connection!: SocketIOClient.Socket;
    private name!: string;
    private color: COLOR;

    constructor(options: ClientOptions) {
        const colors = Object.keys(COLOR);
        this.connectionAddress = options.connectionAddress;
        this.color = options?.loggingOptions?.color || COLOR[colors[Math.round(Math.random() * (colors.length - 1))]];
        this.name = options?.loggingOptions?.name || 'Client';
    }

    public connect(): void {
        this.connection = SocketIOClient(this.connectionAddress);
        this.connection.on('connect', (): void => {
            this.log(`┌─ Connect Success ─────────────────────────┐`);
            this.log(`│ Name        : ${this.name.padEnd(28)}│`);
            this.log(`│ Host Server : ${this.connectionAddress.padEnd(28)}│`);
            this.log(`└───────────────────────────────────────────┘`);
        });

        this.connection.on('disconnect', (): void => {
            this.log(`┌─ Disconnected... ─────────────────────────┐`);
            this.log(`│ Name        : ${this.name.padEnd(28)}│`);
            this.log(`│ Host Server : ${this.connectionAddress.padEnd(28)}│`);
            this.log(`└───────────────────────────────────────────┘`);
        });
    }

    public disconnect(): void {
        this.connection.removeAllListeners();
        this.connection.close();
    }

    public log(message: string): void {
        console.log(this.color, `[${new Date().toISOString()}] (${this.name}) ${message}`, COLOR.Reset);
    }
}

export default Client;
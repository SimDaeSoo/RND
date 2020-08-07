import Server from "./Server";
import { MasterOptions, LoggingOptions, COLOR } from "../interfaces";

interface Dictionary<T> {
    [key: string]: T;
}

interface SlaveData {
    ip: string;
    socket: SocketIO.Socket;
}

class Master {
    private server!: Server;
    private slaves!: Server;
    private _slaves: Dictionary<SlaveData> = {};

    constructor(options: MasterOptions) {
        const colors: Array<string> = Object.keys(COLOR);
        const loggingOptions: LoggingOptions = {};
        loggingOptions.color = options?.loggingOptions?.color || COLOR[colors[Math.round(Math.random() * (colors.length - 1))]];
        loggingOptions.name = options?.loggingOptions?.name || 'Master';

        this.server = new Server({ ...options.serverOptions, loggingOptions });
        this.slaves = new Server({ ...options.slavesOptions, loggingOptions });
    }

    public async open(): Promise<void> {
        await this.server.open();
        await this.slaves.open();
        this.setListener();
    }

    public close(): void {
        this.server.close();
        this.slaves.close();
    }

    private setListener(): void {
        this.slaves.connection.on('connection', (socket: SocketIO.Socket): void => {
            const remoteAddress: string = socket.conn.remoteAddress.replace(/::ffff:/g, '');
            const isVaild: boolean = this.isValidSlaveAddress(remoteAddress);
            if (isVaild) {
                this._slaves[socket.id] = { ip: remoteAddress, socket: socket };
                this.slaves.log(`Slave server[${remoteAddress}] connected`, `[current ${Object.keys(this._slaves).length} slaves]`);
            } else {
                socket.disconnect();
            }
        });
    }

    private isValidSlaveAddress(address: string): boolean {
        const confirmedAddresses: Array<string> = ['127.0.0.1'];
        return confirmedAddresses.indexOf(address) >= 0;
    }
}

export default Master;
import type { Port } from '../../typings/webext/runtime';

import type { Packet } from './Channel';
import type { RemoteAction } from './RemoteAction';
import type { TowerService } from './tower_like_ipc/traits';

export class ServerConnection {
    private _port: Port;
    private _onMessage: (this: this, packet: Packet<RemoteAction>) => void;
    private _onDissconnect: (this: this, port: Port) => void;

    private _service: TowerService<RemoteAction, void>;

    constructor(port: Port, service: TowerService<RemoteAction, void>) {
        this._port = port;
        this._onMessage = this.onMessage.bind(this);
        this._onDissconnect = this.onDisconnect.bind(this);
        this._service = service;
    }

    private _initialize(): void {
        const port = this._port;
        port.onMessage.addListener(this._onMessage);
        port.onDisconnect.addListener(this._onDissconnect);
    }

    destory(): void {
        const port = this._port;
        port.onMessage.removeListener(this._onMessage);
        port.onDisconnect.removeListener(this._onDissconnect);

        this._service = null as never;
        this._onDissconnect = null as never;
        this._onMessage = null as never;
        this._port = null as never;
    }

    run(): void {
        this._initialize();
    }

    onMessage(packet: Packet<RemoteAction>): void {
        this._callService(packet).catch(console.error);
    }

    private async _callService(packet: Packet<RemoteAction>): Promise<void> {
        await this._service.call(packet.payload);
    }

    onDisconnect(): void {
        this.destory();
    }
}

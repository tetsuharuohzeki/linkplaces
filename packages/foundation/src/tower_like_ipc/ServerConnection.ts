import type { ExtensionPort } from '@linkplaces/webext_types';

import { assertPacket, type Packet } from './Packet.js';
import type { PacketCreationService } from './PacketCreationService.js';

export class ServerConnection<TRequestBody, TResponse> {
    private _port: ExtensionPort;
    private _onMessage: (this: this, packet: object) => void;
    private _onDissconnect: (this: this, port: ExtensionPort) => void;

    private _service: PacketCreationService<unknown, TResponse>;

    constructor(port: ExtensionPort, service: PacketCreationService<TRequestBody, TResponse>) {
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

    onMessage(packet: object): void {
        assertPacket(packet);
        this._callService(packet).catch(console.error);
    }

    private async _callService(packet: Packet<unknown>): Promise<void> {
        const res = await this._service.call(packet);
        if (!res) {
            return;
        }

        this._port.postMessage(res);
    }

    onDisconnect(): void {
        this.destory();
    }
}

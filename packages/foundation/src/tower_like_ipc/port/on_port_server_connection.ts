import type { ExtensionPort } from '@linkplaces/webext_types';

import type { PacketCreationService } from './packet_creation_service.js';
import { assertPacket, type Packet } from './packet_type.js';

export class OnPortServerConnection {
    private _port: ExtensionPort;
    private _onMessage: typeof OnPortServerConnection.prototype.onMessage = this.onMessage.bind(this);
    private _onDissconnect: typeof OnPortServerConnection.prototype.onDisconnect = this.onDisconnect.bind(this);

    private _service: PacketCreationService<unknown, unknown>;

    constructor(port: ExtensionPort, service: PacketCreationService<unknown, unknown>) {
        this._port = port;
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
        const res = await this._service.process(packet);
        if (!res) {
            return;
        }

        this._port.postMessage(res);
    }

    onDisconnect(_port: ExtensionPort): void {
        this.destory();
    }
}

import type { ExtensionRuntime, ExtensionMessageSender } from '@linkplaces/webext_types';
import type { Nullable } from 'option-t/Nullable/Nullable';

import { assertPacket, type Packet } from './Packet.js';
import type { PacketCreationService } from './PacketCreationService.js';

export class MessageServer {
    private _runtime: ExtensionRuntime;
    private _onMessage: (this: this, message: object, sender: ExtensionMessageSender) => Promise<unknown>;

    private _service: PacketCreationService<unknown, unknown>;

    constructor(runtime: ExtensionRuntime, service: PacketCreationService<unknown, unknown>) {
        this._runtime = runtime;
        this._onMessage = this.onMessage.bind(this);
        this._service = service;
    }

    private _initialize(): void {
        const runtime = this._runtime;
        runtime.onMessage.addListener(this._onMessage);
    }

    destory(): void {
        const runtime = this._runtime;
        runtime.onMessage.removeListener(this._onMessage);

        this._service = null as never;
        this._onMessage = null as never;
        this._runtime = null as never;
    }

    run(): void {
        this._initialize();
    }

    async onMessage(message: object, _sender: ExtensionMessageSender): Promise<unknown> {
        assertPacket(message);
        const res = this._callService(message);
        return res;
    }

    private async _callService(packet: Packet<unknown>): Promise<Nullable<Packet<unknown>>> {
        const res = await this._service.call(packet);
        return res;
    }
}

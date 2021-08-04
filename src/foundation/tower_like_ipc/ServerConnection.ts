import type { Nullable } from 'option-t/esm/Nullable/Nullable';
import type { Result } from 'option-t/esm/PlainResult';

import type { ExtensionPort } from '../../../typings/webext/ExtensionPort';

import { assertPacket, Packet } from './Packet';
import type { TowerService } from './traits';

interface PacketCreationService<TRequestBody, TResponse> extends TowerService<Packet<TRequestBody>, Nullable<Packet<TResponse>>> {}

type AssertTypeGuardFn<T> = (value: unknown) => asserts value is T;

export class OneShotResponder<TRequestBody, TResponse> implements PacketCreationService<unknown, null> {
    private _source: TowerService<TRequestBody, TResponse>;
    private _validator: AssertTypeGuardFn<TRequestBody>;

    constructor(source: TowerService<TRequestBody, TResponse>, validator: AssertTypeGuardFn<TRequestBody>) {
        this._source = source;
        this._validator = validator;
    }

    destroy(): void {
        this._source = null as never;
    }

    ready(): Promise<Result<void, Error>> {
        return this._source.ready();
    }

    async call(req: Packet<unknown>): Promise<null> {
        const payload = req.payload;
        this._validator(payload);
        await this._source.call(payload);
        return null;
    }
}

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

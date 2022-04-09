import type { ExtensionPort } from '@linkplaces/webext_types';

import { isNull } from 'option-t/Nullable/Nullable';
import { isUndefined } from 'option-t/Undefinable/Undefinable';

import { createPacket, createOneShotPacket, assertPacket } from './Packet.js';

interface PromiseResolverTuple {
    readonly resolve: (result?: unknown) => void;
    readonly reject: (e?: unknown) => void;
}

export class ClientConnection<in TPayload> {
    private _port: ExtensionPort;
    private _callback: Map<number, PromiseResolverTuple>;
    private _callbackIdCandidate: number;

    private _onMessage: (this: this, msg: object) => void;

    constructor(port: ExtensionPort) {
        this._port = port;
        this._callback = new Map();
        this._callbackIdCandidate = 0;
        this._onMessage = this.onMessage.bind(this);

        this._initialize();
    }

    private _initialize(): void {
        const port = this._port;
        port.onMessage.addListener(this._onMessage);
    }

    private _finalize(): void {
        const port = this._port;

        port.disconnect();
        port.onMessage.removeListener(this._onMessage);

        this._callback.clear();
    }

    destroy() {
        this._finalize();

        this._onMessage = null as never;
        this._callback = null as never;
        this._port = null as never;
    }

    postMessage(payload: TPayload): Promise<unknown> {
        const task = new Promise<unknown>((resolve, reject) => {
            const id = this._incrementRequestId();

            this._callback.set(id, {
                resolve,
                reject,
            });

            const port = this._port;

            const packet = createPacket(id, payload);
            port.postMessage(packet);
        });
        return task;
    }

    postOneShotMessage(payload: TPayload): void {
        const packet = createOneShotPacket<TPayload>(payload);
        const port = this._port;
        port.postMessage(packet);
    }

    private onMessage(packet: object): void {
        assertPacket(packet);

        const { id, payload } = packet;
        if (isNull(id)) {
            throw new TypeError(
                'For response, Packet.id must be not undefined.'
            );
        }

        this._processResponse(id, payload);
    }

    private _processResponse(id: number, payload: unknown): void {
        const callbackMap = this._callback;
        const tuple = callbackMap.get(id);
        if (isUndefined(tuple)) {
            throw new TypeError(`no promise resolver, id: ${String(id)}, payload: ${String(payload)}`);
        }

        const { resolve } = tuple;

        finalizePromiseResolverTuple(tuple);
        callbackMap.delete(id);

        resolve(payload);

        if (callbackMap.size === 0) {
            this._resetRequestId();
        }
    }

    private _incrementRequestId(): number {
        const id = this._callbackIdCandidate;
        if (id > Number.MAX_SAFE_INTEGER) {
            throw new RangeError(`the rpc id has been over MAX_SAFE_INTEGER. Please restart this extension`);
        }

        this._callbackIdCandidate = id + 1;
        return id;
    }

    private _resetRequestId(): void {
        this._callbackIdCandidate = 0;
    }
}

type Mutable<T> = {
    -readonly [P in keyof T]: T[P];
};

function finalizePromiseResolverTuple(tuple: Mutable<PromiseResolverTuple>): void {
    // eslint-disable-next-line no-param-reassign
    tuple.resolve = null as never;
    // eslint-disable-next-line no-param-reassign
    tuple.reject = null as never;
}

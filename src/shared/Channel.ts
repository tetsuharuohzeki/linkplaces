import { Nullable } from 'option-t/es6/Nullable';

import { Port } from '../../typings/webext/runtime';

import { RemoteActionBase } from './RemoteAction';

type PromiseTuple = Readonly<{
    resolve: (result?: any) => void;
    reject: (e?: any) => void;
}>;

export type Packet<T> = Readonly<{
    id?: number;
    payload: T;
    isRequest: boolean;
}>;

export class Channel {

    private _port: Nullable<Port>;
    private _callback: Map<number, PromiseTuple>;
    private _callbackId: number;
    private _subject: Subject<Packet<any>>;

    private _listener: (msg: Packet<any>) => void;

    constructor(port: Port) {
        this._port = port;
        this._callback = new Map();
        this._callbackId = 0;
        this._subject = new Subject();

        const listener = this._listener = (msg: Packet<any>) => {
            this._onPortMessage(msg);
        };

        port.onMessage.addListener(listener);

        Object.seal(this);
    }

    destroy() {
        this._finalize();

        //this._listeners = null; // XXX: we think this need not because this is a builtin object.
        // this._callback = null; // XXX: we think this need not because this is a builtin object.
        this._listener = null as any;
        this._callback = null as any;
        this._port = null;
    }

    private _finalize() {
        if (this._port === null) {
            throw new TypeError(`this port must not be null`);
        }
        this._port.disconnect();
        this._port.onMessage.removeListener(this._listener);
        this._callback.clear();
        this._subject.destroy();
    }

    postMessage<TMessage extends RemoteActionBase, R>(msg: TMessage): Promise<R> {
        const task = new Promise<R>((resolve, reject) => {
            const port = this._port;
            if (!port) {
                throw new TypeError('`this._port` is null');
            }

            const id = this._callbackId;
            this._callbackId = id + 1;

            const message: Packet<TMessage> = {
                id,
                payload: msg,
                isRequest: true,
            };

            this._callback.set(id, {
                resolve,
                reject,
            });

            port.postMessage(message);
        });
        return task;
    }

    postOneShotMessage<TMessage extends RemoteActionBase>(msg: TMessage): void {
        const message: Packet<TMessage> = {
            payload: msg,
            isRequest: true,
        };

        const port = this._port;
        if (!port) {
            throw new TypeError('`this._port` is null');
        }

        port.postMessage<Packet<TMessage>>(message);
    }

    replyOneShot<TMessage extends RemoteActionBase>(msg: TMessage): void {
        const message: Packet<TMessage> = {
            payload: msg,
            isRequest: false,
        };

        const port = this._port;
        if (!port) {
            throw new TypeError('`this._port` is null');
        }

        port.postMessage(message);
    }

    private _onPortMessage<T extends RemoteActionBase>(msg: Packet<T>): void {
        const { id, payload, isRequest, } = msg;
        if (id === undefined) {
            throw new TypeError('in this path, Packet.id must not be undefined.');
        }

        if (isRequest !== undefined && isRequest === true) {
            this._subject.next(msg);
            return;
        }

        const callbackMap = this._callback;
        const tuple = callbackMap.get(id);
        if (!tuple) {
            throw new TypeError(`no promise resolver: ${JSON.stringify(msg)}`);
        }

        const { resolve } = tuple;

        callbackMap.delete(id);
        resolve(payload.value);

        if (callbackMap.size === 0) {
            this._callbackId = 0;
        }
    }

    addListener(callback: (v: Packet<any>) => void): void {
        this._subject.addListener(callback);
    }

    removeListener(callback: (v: Packet<any>) => void): void {
        this._subject.removeListener(callback);
    }
}

function connectToBgScript(pingMessage: string): Promise<Port> {
    const p = browser.runtime.connect<void>({
        name: pingMessage,
    });
    return p;
}

export async function createChannelToBackground(pingMessage: string): Promise<Channel> {
    const port = await connectToBgScript(pingMessage);
    const c = new Channel(port);
    return c;
}

class Subject<T> {
    private _callbackset: Set<(v: T) => void>;

    constructor() {
        this._callbackset = new Set();
    }

    destroy(): void {
        this._callbackset.clear();
    }

    next(v: T): void {
        for (const c of this._callbackset) {
            try {
                c(v);
            }
            catch (e) {
                console.error(e);
            }
        }
    }

    addListener(callback: (v: T) => void): void {
        this._callbackset.add(callback);
    }

    removeListener(callback: (v: T) => void): void {
        this._callbackset.delete(callback);
    }
}

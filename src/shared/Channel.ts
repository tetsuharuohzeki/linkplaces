import { Nullable } from 'option-t/esm/Nullable/Nullable';
import { expectNotNull } from 'option-t/esm/Nullable/expect';
import { isNotUndefined, isUndefined } from 'option-t/esm/Undefinable/Undefinable';

import { Port } from '../../typings/webext/runtime';

import { RemoteActionBase } from './RemoteAction';

type PromiseTuple = Readonly<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolve: (result?: any) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reject: (e?: any) => void;
}>;

export type Packet<T> = Readonly<{
    id?: number;
    payload: T;
    isRequest: boolean;
}>;

export class Subscription {
    private _callback: () => void;

    constructor(callback: () => void) {
        this._callback = callback;
    }

    unsubscribe(): void {
        this._callback();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this._callback = null as any;
    }
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

    subscribe(callback: (v: T) => void): Subscription {
        this._callbackset.add(callback);
        const s = new Subscription(() => {
            this._callbackset.delete(callback);
        });
        return s;
    }
}

export class Channel<TMessage extends RemoteActionBase> {

    private _port: Nullable<Port>;
    private _callback: Map<number, PromiseTuple>;
    private _callbackId: number;
    private _subject: Subject<Packet<TMessage>>;

    private _listener: (msg: Packet<TMessage>) => void;

    constructor(port: Port) {
        this._port = port;
        this._callback = new Map();
        this._callbackId = 0;
        this._subject = new Subject();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const listener = (msg: Packet<TMessage>) => {
            this._onPortMessage(msg);
        };
        this._listener = listener;

        port.onMessage.addListener(listener);

        Object.seal(this);
    }

    destroy() {
        this._finalize();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this._listener = null as any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this._callback = null as any;
        this._port = null;
    }

    private _finalize() {
        const port = expectNotNull(this._port, 'this port must not be null');

        port.disconnect();
        port.onMessage.removeListener(this._listener);

        this._callback.clear();
        this._subject.destroy();
    }

    postMessage<TResult>(msg: TMessage): Promise<TResult> {
        const task = new Promise<TResult>((resolve, reject) => {
            const port = expectNotNull(this._port, 'this._port` is null');

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

    postOneShotMessage(msg: TMessage): void {
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

        const port = expectNotNull(this._port, 'this._port` is null');
        port.postMessage(message);
    }

    private _onPortMessage(msg: Packet<TMessage>): void {
        const { id, payload, isRequest, } = msg;
        if (isUndefined(id)) {
            throw new TypeError('in this path, Packet.id must not be undefined.');
        }

        if (isNotUndefined(isRequest) && isRequest === true) {
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

    subscribe(callback: (v: Packet<TMessage>) => void): Subscription {
        const s = this._subject.subscribe(callback);
        return s;
    }
}

function connectToBgScript(pingMessage: string): Promise<Port> {
    const p = browser.runtime.connect<void>({
        name: pingMessage,
    });
    return p;
}

export async function createChannelToBackground<T extends RemoteActionBase>(pingMessage: string): Promise<Channel<T>> {
    const port = await connectToBgScript(pingMessage);
    const c = new Channel<T>(port);
    return c;
}

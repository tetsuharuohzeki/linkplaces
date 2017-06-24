import { Observable, Subject } from 'rxjs';

import { Port } from '../../../typings/webext/runtime';

type PromiseTuple = Readonly<{
    resolve: (result?: any) => void;
    reject: (e?: any) => void;
}>;

export type Msg<T> = Readonly<{
    id: number;
    type: string;
    value: T;
    isRequest?: boolean;
}>;

export class Channel {

    private _port: Port<any> | null;
    private _callback: Map<number, PromiseTuple>;
    private _callbackId: number;
    private _subject: Subject<any>;

    private _listener: Function;

    constructor(port: Port<any>) {
        this._port = port;
        this._callback = new Map();
        this._callbackId = 0;
        this._subject = new Subject();

        const listener = this._listener = (msg: Msg<any>) => {
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
        this._subject.unsubscribe();
    }

    postMessage<R>(type: string, value: any): Promise<R> {
        const task = new Promise<R>((resolve, reject) => {
            const id = this._callbackId;
            this._callbackId = id + 1;

            const message = {
                type,
                id,
                value,
            };
            this._callback.set(id, {
                resolve,
                reject,
            });

            const port = this._port;
            if (!port) {
                throw new TypeError('`this._port` is null');
            }

            port.postMessage(message);
        });
        return task;
    }

    postOneShotMessage(type: string, value: any): void {
        const message = {
            type,
            value,
        };

        const port = this._port;
        if (!port) {
            throw new TypeError('`this._port` is null');
        }

        port.postMessage(message);
    }

    private _onPortMessage(msg: Msg<any>): void {
        const { id, value, isRequest, } = msg;
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
        resolve(value);

        if (callbackMap.size === 0) {
            this._callbackId = 0;
        }
    }

    asObservable(): Observable<any> {
        return this._subject.asObservable();
    }
}

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

import { WebExtGlobal } from '../../../typings/webext';
import { WebExtRuntimeService, Port } from '../../../typings/webext/runtime';

type PromiseTuple = Readonly<{
    resolve: (result?: any) => void;
    reject: (e?: any) => void;
}>;

interface Listener {
    onWebExtMessage<T>(type: string, value: T): void;
}
function isListener(v: any): v is Listener {
    return (typeof v.onWebExtMessage === 'function');
}

type Msg<T> = Readonly<{
    id: number;
    type: string;
    value: T;
    isRequest?: boolean;
}>;

export class WebExtRTMessageChannel {

    static async create(browser: WebExtGlobal): Promise<WebExtRTMessageChannel> {
        const port = await getPort(browser.runtime);
        const inst = new WebExtRTMessageChannel(port);
        return inst;
    }

    private _port: Port<any> | null;
    private _callback: Map<number, PromiseTuple>;
    private _callbackId: number;
    private _listeners: Set<Listener>;

    private _onMessageListener: ((msg: Msg<any>) => void) | null;

    private constructor(port: Port<any>) {
        this._port = port;
        this._callback = new Map();
        this._callbackId = 0;

        this._listeners = new Set();
        this._onMessageListener = null;

        Object.seal(this);

        this._init();
    }

    destroy() {
        this._finalize();

        //this._listeners = null; // XXX: we think this need not because this is a builtin object.
        // this._callback = null; // XXX: we think this need not because this is a builtin object.
        this._onMessageListener = null;
        this._listeners = null as any;
        this._callback = null as any;
        this._port = null;
    }

    private _init() {
        const port = this._port;
        if (port === null) {
            throw new TypeError();
        }

        this._onMessageListener = (msg: Msg<any>) => {
            this._onPortMessage(msg);
        };

        port.onMessage.addListener(this._onMessageListener);
    }

    private _finalize() {
        if (this._port === null) {
          throw new TypeError();
        }

        this._port.onMessage.removeListener(this._onMessageListener);
        this._callback.clear();
        this._listeners.clear();
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
            this._callListeners(msg);
            return;
        }

        const callbackMap = this._callback;
        const tuple = callbackMap.get(id);
        if (!tuple) {
            throw new TypeError('no promise resolver');
        }

        const { resolve } = tuple;

        callbackMap.delete(id);
        resolve(value);

        if (callbackMap.size === 0) {
            this._callbackId = 0;
        }
    }

    private _callListeners(msg: Msg<any>): void {
        const { type, value, } = msg;
        for (const listener of this._listeners) {
            listener.onWebExtMessage<any>(type, value);
        }
    }

    addListener(listener: Listener): void {
        if (!isListener(listener)) {
            throw new TypeError();
        }
        this._listeners.add(listener);
    }

    removeListener(listener: Listener): void {
        this._listeners.delete(listener);
    }
}

function getPort(runtime: WebExtRuntimeService): Promise<Port<any>> {
  const port: Promise<Port<any>> = new Promise((resolve) => {
    runtime.onConnect.addListener(function onConnect(port: Port<any>) {
      runtime.onConnect.removeListener(onConnect);
      resolve(port);
    });
  });
  return port;
}

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*::
  type PromiseTuple = [(result?: mixed) => void, (error?: any) => void];
*/

export class WebExtRTMessageChannel {

  static create(browser /* :{| runtime: webext$runtime$runtime |} */) /* :Promise<WebExtRTMessageChannel> */ {
    const inst = new WebExtRTMessageChannel(browser);
    return Promise.resolve(inst);
  }

  /*::
  _runtime: webext$runtime$runtime | null;
  _port: webext$runtime$Port | null;
  _callback: Map<number, PromiseTuple>;
  _callbackId: number;
  _listeners: Set<{| onWebExtMessage: (type: string, value: any) => void |}>;
*/

  constructor(browser /* :{| runtime: webext$runtime$runtime |} */) {
    this._runtime = browser.runtime;
    this._port = null;
    this._callback = new Map();
    this._callbackId = 0;

    this._listeners = new Set();

    Object.seal(this);
    this._init();
  }

  destroy() {
    this._finalize();

    //this._listeners = null; // XXX: we think this need not because this is a builtin object.
    // this._callback = null; // XXX: we think this need not because this is a builtin object.
    this._runtime = null;
    this._port = null;
  }

  _init() {
    const runtime = this._runtime;
    if (runtime === null) {
      throw new TypeError();
    }

    runtime.onConnect.addListener((port) => {
      this._port = port;
      port.onMessage.addListener((msg) => {
        this._onPortMessage(msg);
      });
    });
  }

  _finalize() {
    this._callback.clear();
    this._listeners.clear();
  }

  /**
   *  @template T, R
   *  @param  {string}  type
   *  @param  {T} value
   *  @returns  {Promise<R>}
   */
  postMessage(type, value) {
    const task = new Promise((resolve, reject) => {
      const id = this._callbackId;
      this._callbackId = id + 1;
      const message = {
        type,
        id,
        value,
      };
      this._callback.set(id, [resolve, reject]);

      const port = this._port;
      if (!port) {
        throw new TypeError("`this._port` is null");
      }

      port.postMessage(message);
    });
    return task;
  }

  /**
   *  @template T, R
   *  @param  {string}  type
   *  @param  {T} value
   *  @returns  {void}
   */
  postOneShotMessage(type, value) {
    const message = {
      type,
      value,
    };

    const port = this._port;
    if (!port) {
      throw new TypeError("`this._port` is null");
    }

    port.postMessage(message);
  }

  /**
   *  @template T
   *  @param  { { id: number, type: string, value: T, } }  msg
   *  @returns  {void}
   */
  _onPortMessage(msg) {
    const { id, value, isRequest, } = msg;
    if (isRequest !== undefined && isRequest === true) {
      this._callListeners(msg);
      return;
    }

    const callbackMap = this._callback;
    const tuple = callbackMap.get(id);
    if (!tuple) {
      throw new TypeError("no promise resolver");
    }

    const [resolver] = tuple;

    callbackMap.delete(id);
    resolver(value);

    if (callbackMap.size === 0) {
      this._callbackId = 0;
    }
  }

  _callListeners(msg) {
    const { type, value, } = msg;
    for (const listener of this._listeners) {
      listener.onWebExtMessage(type, value);
    }
  }

  addListener(listener /* :{| onWebExtMessage: (type: string, value: any) => void |} */) {
    if ( !("onWebExtMessage" in listener) ) {
      throw new TypeError();
    }
    this._listeners.add(listener);
  }

  removeListener(listener /* :{| onWebExtMessage: (type: string, value: any) => void |} */) {
    this._listeners.delete(listener);
  }
}

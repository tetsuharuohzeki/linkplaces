/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*eslint-env commonjs */

"use strict";

class WebExtRTMessageChannel {

  /**
   *  @param  { { runtime: ? } } browser
   *  @returns {WebExtRTMessageChannel}
   */
  static create(browser) {
    const inst = new WebExtRTMessageChannel(browser);
    return Promise.resolve(inst);
  }

  constructor(browser) {
    this._runtime = browser.runtime;
    this._port = null;
    this._callback = new Map();
    this._callbackId = 0;

    Object.seal(this);
    this._init();
  }

  destroy() {
    this._finalize();

    this._callback = null;
    this._runtime = null;
    this._port = null;
  }

  _init() {
    this._runtime.onConnect.addListener((port) => {
      this._port = port;
      port.onMessage.addListener((msg) => {
        this._onPortMessage(msg);
      });
    });
  }

  _finalize() {
    this._callback.clear();
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
      this._port.postMessage(message);
    });
    return task;
  }

  /**
   *  @template T
   *  @param  { { id: number, type: string, value: T, } }  msg
   *  @returns  {void}
   */
  _onPortMessage(msg) {
    const { id, value, } = msg;
    if (!this._callback.has(id)) {
      throw new TypeError("no promise resolver");
    }

    const [resolver] = this._callback.get(id);
    this._callback.delete(id);
    resolver(value);

    if (this._callback.size === 0) {
      this._callbackId = 0;
    }
  }
}

module.exports = Object.freeze({
  WebExtRTMessageChannel,
});

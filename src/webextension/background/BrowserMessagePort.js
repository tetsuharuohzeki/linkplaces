/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/* @flow */

/*::
  type IPCMsg<T> = {|
    id: number;
    type: string;
    value: T;
  |};

  type ListenerFn<R1, R2> = (msg: IPCMsg<{| where: string; url: string; |}>,
                             sender: webext$runtime$MessageSender,
                             sendResponse: (res: R1) => void) => (boolean | Promise<R2>);
*/

export class BrowserMessagePort {

  /**
   *  @param  {?} browser
   *  @param  {Function}  listener
   *  @return   {BrowserMessagePort}
   */
  static create(browser /* :any */, listener /* :ListenerFn<any, any> */) /* :BrowserMessagePort */ {
    const r = new BrowserMessagePort(browser.runtime, listener);
    return r;
  }

  /*::
    _port: webext$runtime$Port | null;
    _listener: Function | null;
  */

  constructor(runtime /* :webext$runtime$runtime */, listener /* :Function */) {
    const port = runtime.connect("");

    this._port = port;
    this._listener = listener;

    port.onMessage.addListener(listener);
  }

  destroy() {
    if (this._port === null || this._listener === null) {
      throw new TypeError();
    }

    this._port.onMessage.removeListener(this._listener);

    this._listener = null;
    this._port = null;
  }
}

/* vim: set filetype=javascript shiftwidth=2 tabstop=2 expandtab: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*eslint-env commonjs */
"use strict";

// eslint-disable-next-line no-unused-vars
const EXPORTED_SYMBOLS = ["ChromeDocObserver"];

const Ci = Components.interfaces;
const Cu = Components.utils;

const { XPCOMUtils } = Cu.import("resource://gre/modules/XPCOMUtils.jsm", {});
const { Services } = Cu.import("resource://gre/modules/Services.jsm", {});

class ChromeDocObserver {
  constructor({ onDOMContentLoaded }) {
    this._onDOMContentLoaded = onDOMContentLoaded;
    this.QueryInterface = XPCOMUtils.generateQI([Ci.nsIObserver,
                                                 Ci.nsISupportsWeakReference,
                                                 Ci.nsISupports]);
    Object.seal(this);
    this._init();
  }

  destroy() {
    this._finalize();

    this.QueryInterface = null;
    this._onDOMContentLoaded = null;
  }

  _init() {
    this.register();
  }

  _finalize() {
    this.unregister();
  }

  register() {
    Services.obs.addObserver(this, "chrome-document-global-created", false);
  }

  unregister() {
    Services.obs.removeObserver(this, "chrome-document-global-created");
  }

  /**
   * Observer method.
   *
   * @param {nsISupports} aSubject
   *   In general reflects the object whose change or action is being observed.
   * @param {string}      aTopic
   *   Indicates the specific change or action.
   * @param {wstring}     aData
   *   An optional parameter or other auxiliary data further describing the change or action.
   * @return {void}
   */
  observe(aSubject/*, aTopic, aData*/) {
    aSubject.addEventListener("DOMContentLoaded", this, false);
  }

  handleEvent(event) {
    const win = event.currentTarget;
    win.removeEventListener("DOMContentLoaded", this, false);

    this.onDOMContentLoaded(win);
  }

  onDOMContentLoaded(win) {
    this._onDOMContentLoaded(win);
  }
}

this.ChromeDocObserver = ChromeDocObserver; // eslint-disable-line no-invalid-this

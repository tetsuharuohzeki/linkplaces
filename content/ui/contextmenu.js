/* vim: set filetype=javascript shiftwidth=2 tabstop=2 expandtab: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*eslint-env commonjs */
"use strict";

class ContextMenuItem {
  constructor(win, param) {
    this._dom = null;
    this._onCommand = null;

    this._init(win, param);
  }

  destroy() {
    this._finalize();

    this._onCommand = null;
    this._dom = null;
  }

  _init(win, { id, label, onCommand, mountpoint, attr}) {
    const dom = win.document.createElement("menuitem");
    dom.setAttribute("id", id);
    dom.setAttribute("label", label);
    dom.addEventListener("command", this, false);

    if (!!attr) {
      for (let [key, value] of attr.entries()) { //eslint-disable-line prefer-const
        dom.setAttribute(key, value);
      }
    }

    this._dom = dom;
    this._onCommand = onCommand;

    const mp = win.document.querySelector(mountpoint);
    mp.parentNode.insertBefore(dom, mp);
  }

  _finalize() {
    this._dom.parentNode.removeChild(this._dom);
    this._dom.removeEventListener("command", this, false);
  }

  handleEvent(event) {
    switch (event.type) {
      case "command":
        this._onCommand(event);
        break;
    }
  }

  finalize() {
    this._dom.parentNode.removeChild(this._dom);

    this._dom.removeEventListener("command", this, false);
    this._onCommand = null;
    this._dom = null;
  }

  onCommand() {
    this._onCommand();
  }
}

module.exports = Object.freeze({
  ContextMenuItem,
});

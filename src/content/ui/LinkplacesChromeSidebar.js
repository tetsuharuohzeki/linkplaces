/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

export const SIDEBAR_BROADCAST_ID = "viewLinkplacesSidebar";
export const SHORTCUT_ID = "linkplaces-key-toggleSidebar";

const BROADCASTER_CONTAINER_ID = "mainBroadcasterSet";
const MENUBAR_CONTAINER_ID = "viewSidebarMenu";
const SHORTCUT_CONTAINER_ID = "mainKeyset";
const SIDEBAR_HEADER_SWITCH_CONTAINER_ID = "sidebarMenu-popup";

class ShortcutKey {
  constructor(win, param) {
    this._win = win;
    this._dom = null;

    Object.seal(this);
    this._init(win, param);
  }

  destroy() {
    this._finalize();

    this._dom = null;
    this._win = null;
  }

  _init(win, { subrootId, attr, }) {
    const dom = win.document.createElement("key");
    for (let [name, value] of attr.entries()) { // eslint-disable-line prefer-const
      dom.setAttribute(name, value);
    }
    this._dom = dom;

    win.document.getElementById(subrootId).appendChild(dom);
  }

  _finalize() {
    this._dom.remove();
  }
}

class MenubarItem {
  constructor(win, param) {
    this._win = win;
    this._dom = null;

    Object.seal(this);
    this._init(win, param);
  }

  destroy() {
    this._finalize();

    this._dom = null;
    this._win = null;
  }

  _init(win, { subrootId, attr, }) {
    const dom = win.document.createElement("menuitem");
    for (let [name, value] of attr.entries()) { // eslint-disable-line prefer-const
      dom.setAttribute(name, value);
    }
    this._dom = dom;

    win.document.getElementById(subrootId).appendChild(dom);
  }

  _finalize() {
    this._dom.remove();
  }
}

class Broadcaster {
  constructor(win, param) {
    this._win = win;
    this._dom = null;

    Object.seal(this);
    this._init(win, param);
  }

  destroy() {
    this._finalize();

    this._dom = null;
    this._win = null;
  }

  _init(win, { subrootId, attr, }) {
    const dom = win.document.createElement("broadcaster");
    for (let [name, value] of attr.entries()) { // eslint-disable-line prefer-const
      dom.setAttribute(name, value);
    }
    this._dom = dom;

    win.document.getElementById(subrootId).appendChild(dom);
  }

  _finalize() {
    this._dom.remove();
  }
}

class HeaderSwitcher {

  constructor(win, param) {
    this._win = win;
    this._dom = null;

    Object.seal(this);
    this._init(win, param);
  }

  destroy() {
    this._finalize();

    this._dom = null;
    this._win = null;
  }

  _init(win, { subrootId, insertionPoint, attr, }) {
    const dom = win.document.createElement("toolbarbutton");
    for (let [name, value] of attr.entries()) { // eslint-disable-line prefer-const
      dom.setAttribute(name, value);
    }
    this._dom = dom;

    const observes = win.document.createElement("observes");
    observes.setAttribute("element", SIDEBAR_BROADCAST_ID);
    observes.setAttribute("attribute", "checked");
    dom.appendChild(observes);

    const container = win.document.getElementById(subrootId);
    const ip = container.querySelector(insertionPoint);
    container.insertBefore(dom, ip);
  }

  _finalize() {
    this._dom.remove();
  }
}

export class LinkplacesChromeSidebar {

  constructor(win, parent) {
    this._win = win;
    this._parent = parent;
    this._shortcut = null;
    this._menubar = null;
    this._broadcaster = null;
    this._headerSwitcher = null;

    Object.seal(this);
    this._init();
  }

  destroy() {
    this._finalize();

    this._headerSwitcher = null;
    this._broadcaster = null;
    this._menubar = null;
    this._shortcut = null;
    this._parent = null;
    this._win = null;
  }

  _init() {
    const parent = this._parent;

    this._shortcut = new ShortcutKey(this._win, {
      subrootId: SHORTCUT_CONTAINER_ID,
      attr: new Map([
        ["id", SHORTCUT_ID],
        ["key", parent.service().stringBundle.GetStringFromName("linkplaces.chrome.commandkey")], // eslint-disable-line new-cap,
        ["modifiers", "accel,alt"],
        ["command", SIDEBAR_BROADCAST_ID],
      ]),
    });

    this._menubar = new MenubarItem(this._win, {
      subrootId: MENUBAR_CONTAINER_ID,
      attr: new Map([
        ["id", "linkplaces-menu-sidebar"],
        ["key", SHORTCUT_ID],
        ["observes", SIDEBAR_BROADCAST_ID],
      ]),
    });

    this._broadcaster = new Broadcaster(this._win, {
      subrootId: BROADCASTER_CONTAINER_ID,
      attr: new Map([
        ["id", SIDEBAR_BROADCAST_ID],
        ["label", parent.service().stringBundle.GetStringFromName("linkplaces.chrome.broadcaster.label")], // eslint-disable-line new-cap,
        ["autoCheck", "false"],
        ["type", "checkbox"],
        ["group", "sidebar"],
        ["sidebartitle", parent.service().stringBundle.GetStringFromName("linkplaces.chrome.sidebar.title")], // eslint-disable-line new-cap,
        ["sidebarurl", "chrome://linkplaces/content/sidebar/linkplaces-panel.xul"],

        // XXX: Does not work with `addEventListener()`
        ["oncommand", `SidebarUI.toggle("${SIDEBAR_BROADCAST_ID}")`],
      ]),
    });

    this._headerSwitcher = new HeaderSwitcher(this._win, {
      subrootId: SIDEBAR_HEADER_SWITCH_CONTAINER_ID,
      insertionPoint: "toolbarseparator",
      attr: new Map([
        ["id", "sidebar-switcher-linkplaces"],
        ["label", parent.service().stringBundle.GetStringFromName("linkplaces.chrome.sidebar.title")], // eslint-disable-line new-cap,
        ["class", "subviewbutton subviewbutton-iconic"],
        ["key", SHORTCUT_ID],
        ["observes", SIDEBAR_BROADCAST_ID],
        ["oncommand", `SidebarUI.show('${SIDEBAR_BROADCAST_ID}')`],
      ]),
    });
  }

  _finalize() {
    // Close sidebar to release the reference to it from the current window.
    const win = this._win;
    if (win.SidebarUI.currentID === SIDEBAR_BROADCAST_ID) {
      win.SidebarUI.hide();
    }

    this._shortcut.destroy();
    this._menubar.destroy();
    this._broadcaster.destroy();
    this._headerSwitcher.destroy();
  }
}

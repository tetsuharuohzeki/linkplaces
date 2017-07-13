/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
// @ts-check

export const SIDEBAR_BROADCAST_ID = "viewLinkplacesSidebar";
export const SHORTCUT_ID = "linkplaces-key-toggleSidebar";

const BROADCASTER_CONTAINER_ID = "mainBroadcasterSet";
const MENUBAR_CONTAINER_ID = "viewSidebarMenu";
const SHORTCUT_CONTAINER_ID = "mainKeyset";
const SIDEBAR_HEADER_SWITCH_CONTAINER_ID = "sidebarMenu-popup";

class DOMbuilder {
  /**
   *  @param  {Window}  win
   *  @param  {string}  localname
   *  @param  {Map<string, string>} param
   *  @param  {Iterable<DOMbuilder>} children
   *
   *  @return {DOMbuilder}
   */
  static create(win, localname, param, children) {
    const dom = win.document.createElement(localname);
    for (const [k, v] of param.entries()) {
      dom.setAttribute(k, v);
    }

    for (const c of children) {
      dom.appendChild(c.dom);
    }

    const wrapper = new DOMbuilder(dom);
    return wrapper;
  }

  /**
   *  @private
   *  @param  {Element} dom
   */
  constructor(dom) {
    /** @type {Element | null} */
    this._dom = dom;
    Object.seal(this);
  }

  destroy() {
    this.removeFromParent();
    this._dom = null;
  }

  /**
   *  @type {Element}
   */
  get dom() {
    return this._dom;
  }

  /**
   *  @param  {string} subrootId
   *  @return {void}
   */
  appendToById(subrootId) {
    if (this._dom === null) {
      throw new TypeError(`this._dom is \`null\``);
    }

    const doc = this._dom.ownerDocument;
    const subroot = doc.getElementById(subrootId);
    if (subroot === null) {
      throw new TypeError(`not fount #${subrootId} in the document`);
    }

    subroot.appendChild(this._dom);
  }

  removeFromParent() {
    if (this._dom !== null) {
      this._dom.remove();
    }
  }
}

export class LinkplacesChromeSidebar {

  /**
   *  @param  {Window}  win
   *  @param  {*} parent
   */
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
    /** @type {Window} */
    const
      // @ts-ignore
      win = this._win;

    this._shortcut = DOMbuilder.create(win, "key", new Map([
      ["id", SHORTCUT_ID],
      ["key", parent.service().stringBundle.GetStringFromName("linkplaces.chrome.commandkey")], // eslint-disable-line new-cap,
      ["modifiers", "accel,alt"],
      ["command", SIDEBAR_BROADCAST_ID],
    ]), []);
    this._shortcut.appendToById(SHORTCUT_CONTAINER_ID);

    this._menubar = DOMbuilder.create(win, "menuitem", new Map([
      ["id", "linkplaces-menu-sidebar"],
      ["key", SHORTCUT_ID],
      ["observes", SIDEBAR_BROADCAST_ID],
    ]), []);
    this._menubar.appendToById(MENUBAR_CONTAINER_ID);

    this._broadcaster = DOMbuilder.create(win, "broadcaster", new Map([
      ["id", SIDEBAR_BROADCAST_ID],
      ["label", parent.service().stringBundle.GetStringFromName("linkplaces.chrome.broadcaster.label")], // eslint-disable-line new-cap,
      ["autoCheck", "false"],
      ["type", "checkbox"],
      ["group", "sidebar"],
      ["sidebartitle", parent.service().stringBundle.GetStringFromName("linkplaces.chrome.sidebar.title")], // eslint-disable-line new-cap,
      ["sidebarurl", "chrome://linkplaces/content/sidebar/linkplaces-sidebar.xul"],

      // XXX: Does not work with `addEventListener()`
      ["oncommand", `SidebarUI.toggle("${SIDEBAR_BROADCAST_ID}")`],
    ]), []);
    this._broadcaster.appendToById(BROADCASTER_CONTAINER_ID);

    this._headerSwitcher = DOMbuilder.create(win, "toolbarbutton", new Map([
      ["id", "sidebar-switcher-linkplaces"],
      ["label", parent.service().stringBundle.GetStringFromName("linkplaces.chrome.sidebar.title")], // eslint-disable-line new-cap,
      ["class", "subviewbutton subviewbutton-iconic"],
      ["key", SHORTCUT_ID],
      ["observes", SIDEBAR_BROADCAST_ID],
      ["oncommand", `SidebarUI.show('${SIDEBAR_BROADCAST_ID}')`],
    ]), [
      DOMbuilder.create(win, "observes", new Map([
        ["element", SIDEBAR_BROADCAST_ID],
        ["attribute", "checked"],
      ]), []),
    ]);
    {
      const container = win.document.getElementById(SIDEBAR_HEADER_SWITCH_CONTAINER_ID);
      // @ts-ignore
      const ip = container.querySelector("toolbarseparator");
      // @ts-ignore
      container.insertBefore(this._headerSwitcher.dom, ip);
    }
  }

  _finalize() {
    // Close sidebar to release the reference to it from the current window.
    const win = this._win;
    // @ts-ignore
    if (win.SidebarUI.currentID === SIDEBAR_BROADCAST_ID) {
      // @ts-ignore
      win.SidebarUI.hide();
    }

    // @ts-ignore
    this._shortcut.destroy();
    // @ts-ignore
    this._menubar.destroy();
    // @ts-ignore
    this._broadcaster.destroy();
    // @ts-ignore
    this._headerSwitcher.destroy();
  }
}

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

import { getStringBundle } from '../service/LinkplacesService';

export const SIDEBAR_BROADCAST_ID = 'viewLinkplacesSidebar';
const SHORTCUT_ID = 'linkplaces-key-toggleSidebar';

const BROADCASTER_CONTAINER_ID = 'mainBroadcasterSet';
const MENUBAR_CONTAINER_ID = 'viewSidebarMenu';
const SHORTCUT_CONTAINER_ID = 'mainKeyset';
const SIDEBAR_HEADER_SWITCH_CONTAINER_ID = 'sidebarMenu-popup';

class DOMbuilder {

  static create(win: Window, localname: string, param: Map<string, string>, children: Iterable<DOMbuilder>): DOMbuilder {
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

  private _dom: Element | null;

  private constructor(dom: Element) {
    this._dom = dom;
    Object.seal(this);
  }

  destroy() {
    this.removeFromParent();
    this._dom = null;
  }

  get dom(): Element {
    if (this._dom === null) {
      throw new TypeError('this instance has been dead');
    }

    return this._dom;
  }

  appendToById(subrootId: string): void {
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

  removeFromParent(): void {
    if (this._dom !== null) {
      this._dom.remove();
    }
  }
}

export class LinkplacesChromeSidebar {

  private _win: Window;
  private _shortcut: DOMbuilder | null;
  private _menubar: DOMbuilder | null;
  private _broadcaster: DOMbuilder | null;
  private _headerSwitcher: DOMbuilder | null;

  constructor(win: Window) {
    this._win = win;
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
    this._win = null as any;
  }

  private _init() {
    const win = this._win;
    const stringBundle = getStringBundle();

    const getLabel = (name: string): string => {
      const l = stringBundle.GetStringFromName(name); // eslint-disable-line new-cap,
      if (l === null) {
        throw new TypeError(`not found ${name} in stringBundle`);
      }
      return l;
    };

    this._shortcut = DOMbuilder.create(win, 'key', new Map([
      ['id', SHORTCUT_ID],
      ['key', getLabel('linkplaces.chrome.commandkey')],
      ['modifiers', 'accel,alt'],
      ['command', SIDEBAR_BROADCAST_ID],
    ]), []);
    this._shortcut.appendToById(SHORTCUT_CONTAINER_ID);

    this._menubar = DOMbuilder.create(win, 'menuitem', new Map([
      ['id', 'linkplaces-menu-sidebar'],
      ['key', SHORTCUT_ID],
      ['observes', SIDEBAR_BROADCAST_ID],
    ]), []);
    this._menubar.appendToById(MENUBAR_CONTAINER_ID);

    this._broadcaster = DOMbuilder.create(win, 'broadcaster', new Map([
      ['id', SIDEBAR_BROADCAST_ID],
      ['label', getLabel('linkplaces.chrome.broadcaster.label')],
      ['autoCheck', 'false'],
      ['type', 'checkbox'],
      ['group', 'sidebar'],
      ['sidebartitle', getLabel('linkplaces.chrome.sidebar.title')],
      ['sidebarurl', 'chrome://linkplaces/content/sidebar/linkplaces-sidebar.xul'],

      // XXX: Does not work with `addEventListener()`
      ['oncommand', `SidebarUI.toggle("${SIDEBAR_BROADCAST_ID}")`],
    ]), []);
    this._broadcaster.appendToById(BROADCASTER_CONTAINER_ID);

    this._headerSwitcher = DOMbuilder.create(win, 'toolbarbutton', new Map([
      ['id', 'sidebar-switcher-linkplaces'],
      ['label', getLabel('linkplaces.chrome.sidebar.title')],
      ['class', 'subviewbutton subviewbutton-iconic'],
      ['key', SHORTCUT_ID],
      ['observes', SIDEBAR_BROADCAST_ID],
      ['oncommand', `SidebarUI.show('${SIDEBAR_BROADCAST_ID}')`],
    ]), [
      DOMbuilder.create(win, 'observes', new Map([
        ['element', SIDEBAR_BROADCAST_ID],
        ['attribute', 'checked'],
      ]), []),
    ]);

    {
      const container = win.document.getElementById(SIDEBAR_HEADER_SWITCH_CONTAINER_ID)!;
      const ip = container.querySelector('toolbarseparator');
      container.insertBefore(this._headerSwitcher.dom, ip);
    }
  }

  _finalize() {
    // Close sidebar to release the reference to it from the current window.
    const win = this._win;
    if ((win as any).SidebarUI.currentID === SIDEBAR_BROADCAST_ID) {
      (win as any).SidebarUI.hide();
    }

    this._shortcut!.destroy();
    this._menubar!.destroy();
    this._broadcaster!.destroy();
    this._headerSwitcher!.destroy();
  }
}

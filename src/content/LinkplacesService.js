/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Cu } from "chrome";

import { ChromeDocObserver } from "./service/ChromeDocObserver.js";
import { LinkplacesRepository } from "./service/LinkplacesRepository.js";
import { StyleLoader } from "./service/StyleLoader.js";
import { PrefService } from "./service/pref.js";
import { WebExtRTMessageChannel } from "./service/WebExtRTMessageChannel.js";
import { SIDEBAR_BROADCAST_ID } from "./ui/LinkplacesChromeSidebar";
import { LinkplacesChromePlaces } from "./ui/LinkplacesChromePlaces.js";

const STRING_BUNDLE_URI = "chrome://linkplaces/locale/linkplaces.properties";

const { XPCOMUtils } = Cu.import("resource://gre/modules/XPCOMUtils.jsm", {});
const { Services } = Cu.import("resource://gre/modules/Services.jsm", {});

const modGlobal = Object.create(null);

XPCOMUtils.defineLazyGetter(modGlobal, "stringBundle", function () {
  return Services.strings.createBundle(STRING_BUNDLE_URI);
});

/**
 * LinkplacesService
 *
 * This service provides primary methods & properties for LinkPlaces.
 */
export const LinkplacesService = {

  /**
   * @const
   *  The places query uri for linkplaces folder.
   * @type {string}
   */
  get QUERY_URI() {
    return LinkplacesRepository.QUERY_URI;
  },

  /**
   * Cache strings bundle.
   * @type {nsIStringBundle}
   */
  get stringBundle() {
    return modGlobal.stringBundle;
  },

  /**
   * @obsolatd
   *
   * Returns LinkPlaces folder's id.
   * @type {number}
   */
  get folder() {
    return LinkplacesRepository.folder();
  },

  /**
   * Returns LinkPlaces folder's id.
   * @type {string}
   */
  get folderGuid() {
    return LinkplacesRepository.folderGuid();
  },

  /**
   * Returns default inserted index in Places bookmarks.
   * @type {number}
   */
  get DEFAULT_INDEX() {
    return LinkplacesRepository.DEFAULT_INDEX;
  },

  config() {
    return this._pref;
  },


  /**
   *  @param  { { runtime: ? } } browser
   *  @returns  {void}
   */
  init: function (browser) {
    this._runtime = null;
    WebExtRTMessageChannel.create(browser).then((rt) => {
      this._runtime = rt;

      if (this._pref.PREF.useWebExtContextMenu) {
        this._runtime.postOneShotMessage("linkplaces-enable-webext-ctxmenu", {});
      }
      else {
        this._runtime.postOneShotMessage("linkplaces-disable-webext-ctxmenu", {});
      }

      this._runtime.addListener(this);
    });

    //set user preferences
    this._pref = new PrefService();
    this._chromeDocOpening = new ChromeDocObserver({
      onDOMContentLoaded: (win) => {
        const uri = win.location.href;
        switch (uri) {
          case "chrome://browser/content/browser.xul":
          case "chrome://browser/content/history/history-panel.xul":
          case "chrome://browser/content/places/places.xul":
            LinkplacesChromePlaces.create(win, LinkplacesService);
            break;
        }
      },
    });
    this._styleService = StyleLoader.create();

    this._prefListener = (name, table) => {
      if (name === "useWebExtContextMenu") {
        if (table.useWebExtContextMenu) {
          this._runtime.postMessage("linkplaces-enable-webext-ctxmenu", {});
        }
        else {
          this._runtime.postMessage("linkplaces-disable-webext-ctxmenu", {});
        }
      }
    };
    this._pref.addListener(this._prefListener);
  },

  destroy: function () {
    if (this._runtime !== null) {
      this._runtime.removeListener(this);
    }

    this._pref.removeListener(this._prefListener);
    this._prefListener = null;
    this._styleService.destroy();
    this._styleService = null;
    this._chromeDocOpening.destroy();
    this._chromeDocOpening = null;
    this._pref.destroy();
    this._runtime.destroy();
    this._runtime = null;
  },

  /**
   * Save item to LinkPlaces folder
   *
   * @param {string} aURI
   *   The item's URI.
   * @param {string} aTitle
   *   The item's title.
   * @param {number=} aIndex (optional)
   *   The index which item inserted point.
   * @return {Promise<void>}
   */
  saveItem: function (aURI, aTitle, aIndex) {
    const item = {
      uri  : aURI,
      title: aTitle,
    };
    return this.saveItems([item], aIndex);
  },

  /**
   * @param {Array.<{ uri:string, title:string }>} aItems
   *   The array of saved items.
   *   Items must have the following fields set:
   *   - {string} uri
   *     The item's URI.
   *   - {string} title
   *     The item's title.
   *
   * @param {number=} aIndex (optional)
   *   The index which items inserted point.
   * @return {Promise<void>}
   */
  saveItems: function (aItems, aIndex = LinkplacesRepository.DEFAULT_INDEX) {
    if (this._pref.useAsyncTransactions()) {
      return LinkplacesRepository.saveItemAsync(aItems, aIndex);
    }
    else {
      LinkplacesRepository.saveItems(aItems, aIndex);
      return Promise.resolve();
    }
  },

  /**
   * @param {number} aItemId
   *   The item's id.
   * @return {Promise<void>}
   */
  removeItem: function (aItemId) {
    if (this._pref.useAsyncTransactions()) {
      return LinkplacesRepository.removeItemAsync(aItemId);
    }
    else {
      LinkplacesRepository.removeItem(aItemId);
      return Promise.resolve();
    }
  },

  getLinkSchemeType(url) {
    return getLinkSchemeType(url);
  },

  openTab(url, where) {
    return this._runtime.postMessage("linkplaces-open-tab", {
      url,
      where,
    });
  },

  /**
   *  @param  {!function(string): string} aOriginal
   *    The original `whereToOpenLink()`
   *  @param  {!Event} aEvent
   *  @param  {string}  aURI
   *  @returns  {string}
   */
  whereToOpenLink(aOriginal, aEvent, aURI) {
    let rv = "";
    if (aURI.startsWith("javascript:")) { // eslint-disable-line no-script-url
      // for bookmarklet
      rv = "current";
    }
    else {
      const where = aOriginal(aEvent);
      switch (where) {
        case "current":
          rv = this.config().openLinkTo();
          break;
        default:
          rv = where;
          break;
      }
    }
    return rv;
  },

  onWebExtMessage(type, value) {
    switch (type) {
      case "linkplaces-open-privileged-url": {
        const { url } = value;
        const w = getMostRecentActiveWindow();
        if (w === null) {
          return;
        }
        const where = this._pref.openLinkTo();
        w.openUILinkIn(url, where);
        break;
      }
      case "linkplaces-open-xul-sidebar": {
        const w = getMostRecentActiveWindow();
        if (w === null) {
          return;
        }
        w.SidebarUI.show(SIDEBAR_BROADCAST_ID);
        break;
      }
      case "linkplaces-open-folder-bookmark-in-library": {
        const { id } = value;
        openPlacesOrganizeWindow(id);
        break;
      }
    }
  },
};

function getLinkSchemeType(url) {
  // see https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/tabs/create
  const r = /^(chrome|about|data|javascript):/.exec(url);
  if (r === null) {
    return {
      isPrivileged: false,
    };
  }

  const [, type] = r;
  return {
    isPrivileged: true,
    type,
  };
}

async function openPlacesOrganizeWindow(guid) {
  // This is trick to use WebExt's `bookmarks.BookmarkTreeNode.id` is the same value with
  // Places internal guid.
  const id = await LinkplacesRepository.getItemId(guid);
  const w = getMostRecentActiveWindow();
  if (w === null) {
    return;
  }

  w.PlacesCommandHook.showPlacesOrganizer(["BookmarksMenu", id]);
  //showPlacesOrganizer(["BookmarksMenu", id]);
}

function getMostRecentActiveWindow() {
  const w = getMostRecentWindow();
  // Due to bug 528706, getMostRecentWindow can return closed windows.
  if (!w || w.closed) {
    return null;
  }
  return w;
}

function getMostRecentWindow() {
  const w = Services.wm.getMostRecentWindow("navigator:browser");
  return w;
}

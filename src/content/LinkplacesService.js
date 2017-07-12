/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Cu } from "chrome";

import { LinkplacesRepository } from "./service/LinkplacesRepository.js";
import { StyleLoader } from "./service/StyleLoader.js";
import { PrefService } from "./service/pref.js";
import { WebExtRTMessageChannel } from "./service/WebExtRTMessageChannel.js";
import { SIDEBAR_BROADCAST_ID } from "./ui/LinkplacesChromeSidebar";

const STRING_BUNDLE_URI = "chrome://linkplaces/locale/linkplaces.properties";

const { XPCOMUtils } = Cu.import("resource://gre/modules/XPCOMUtils.jsm", {});
const { PlacesUIUtils } = Cu.import("resource:///modules/PlacesUIUtils.jsm", {});
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

  config() {
    return this._pref;
  },

  /**
   *  @param  { { runtime: ? } } browser
   *  @returns  {void}
   */
  init: function (browser) {
    //set user preferences
    this._pref = new PrefService();

    this._runtime = null;
    WebExtRTMessageChannel.create(browser).then((rt) => {
      this._runtime = rt;
      this._runtime.addListener(this);
    });

    this._styleService = StyleLoader.create();

    this._prefListener = (/*name, table*/) => {// eslint-disable-line no-empty-function
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
    if (PlacesUIUtils.useAsyncTransactions) {
      return LinkplacesRepository.saveItemAsync(aItems, aIndex);
    }
    else {
      return LinkplacesRepository.saveItems(aItems, aIndex);
    }
  },

  /**
   * @param {number} aItemGuid
   *   The item's guid.
   * @return {Promise<void>}
   */
  removeItem(aItemGuid) {
    if (PlacesUIUtils.useAsyncTransactions) {
      return LinkplacesRepository.removeItemAsync(aItemGuid);
    }
    else {
      return LinkplacesRepository.removeItem(aItemGuid);
    }
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
        openPlacesOrganizeWindow(id).catch(Cu.reportError);
        break;
      }
      case "linkplaces-classic-create-item": {
        const { url, title } = value;
        this.saveItem(url, title, LinkplacesRepository.DEFAULT_INDEX).catch(Cu.reportError);
        break;
      }
      case "linkplaces-classic-remove-item": {
        const { id } = value;
        this.removeItem(id).catch(Cu.reportError);
        break;
      }
    }
  },
};

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

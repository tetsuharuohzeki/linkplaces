/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
// @ts-check
import { Cu } from "chrome";

import {
  QUERY_URI,
  getDefaultIndex,
  saveItems,
  saveItemAsync,
  removeItem,
  removeItemAsync,
  getItemId,
} from "./service/LinkplacesRepository.js";
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
 *  @typedef  {object} nsIStringBundle
 *  @property {function(string):(string|null)}  GetStringFromName
 */

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
    return QUERY_URI;
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
   *  @param  { { runtime: any } } browser
   *  @returns  {void}
   */
  init: function (browser) {
    //set user preferences
    this._pref = new PrefService();

    this._runtime = null;
    // @ts-ignore
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
   * @param {number} aIndex
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
   * @param {number} aIndex
   *   The index which items inserted point.
   * @return {Promise<void>}
   */
  saveItems: function (aItems, aIndex) {
    if (PlacesUIUtils.useAsyncTransactions) {
      return saveItemAsync(aItems, aIndex);
    }
    else {
      return saveItems(aItems, aIndex);
    }
  },

  /**
   * @param {number} aItemGuid
   *   The item's guid.
   * @return {Promise<void>}
   */
  removeItem(aItemGuid) {
    if (PlacesUIUtils.useAsyncTransactions) {
      return removeItemAsync(aItemGuid);
    }
    else {
      return removeItem(aItemGuid);
    }
  },

  /**
   *  @param {string} url
   *  @returns  {Promise<?>}
   */
  openTab(url) {
    return this._runtime.postMessage("linkplaces-open-tab", {
      url,
      where: "tab",
    });
  },

  /**
   *  @param {string} type
   *  @param {*} value
   *  @return {void}
   */
  onWebExtMessage(type, value) {
    switch (type) {
      case "linkplaces-open-privileged-url": {
        const { url } = value;
        const w = getMostRecentActiveWindow();
        if (w === null) {
          return;
        }
        w.openUILinkIn(url, "tab");
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
        const ip = getDefaultIndex();
        this.saveItem(url, title, ip).catch(Cu.reportError);
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

/**
 *  @param {string} guid
 *  @return {Promise<void>}
 */
async function openPlacesOrganizeWindow(guid) {
  // This is trick to use WebExt's `bookmarks.BookmarkTreeNode.id` is the same value with
  // Places internal guid.
  const id = await getItemId(guid);
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

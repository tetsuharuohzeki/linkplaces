/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*eslint-env commonjs */

"use strict";

const { Cu, } = require("chrome");

const STRING_BUNDLE_URI = "chrome://linkplaces/locale/linkplaces.properties";

const { XPCOMUtils } = Cu.import("resource://gre/modules/XPCOMUtils.jsm", {});
const { Services } = Cu.import("resource://gre/modules/Services.jsm", {});

/*global stringBundle:false*/
XPCOMUtils.defineLazyGetter(this, "stringBundle", function () { // eslint-disable-line no-invalid-this
  return Services.strings.createBundle(STRING_BUNDLE_URI);
});

const { ChromeDocObserver } = require("chrome://linkplaces/content/service/ChromeDocObserver.js");
const { LinkplacesRepository } = require("chrome://linkplaces/content/service/LinkplacesRepository.js");
const { StyleLoader } = require("chrome://linkplaces/content/service/StyleLoader.js");
const { PrefService } = require("chrome://linkplaces/content/service/pref.js");
const { LinkplacesChromePlaces } = require("./ui/LinkplacesChromePlaces.js");

/**
 * LinkplacesService
 *
 * This service provides primary methods & properties for LinkPlaces.
 */
const LinkplacesService = {

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
    return stringBundle;
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

  init: function () {
    //set user preferences
    this._pref = new PrefService();
    this._chromeDocOpening = new ChromeDocObserver({
      onDOMContentLoaded: (win) => {
        const uri = win.location.href;
        switch (uri) {
          case "chrome://browser/content/browser.xul":
          case "chrome://browser/content/history/history-panel.xul":
          case "chrome://browser/content/bookmarks/bookmarksPanel.xul":
          case "chrome://browser/content/places/places.xul":
            LinkplacesChromePlaces.create(win, LinkplacesService);
            break;
        }
      },
    });
    this._styleService = StyleLoader.create();
  },

  destroy: function () {
    this._styleService.destroy();
    this._styleService = null;
    this._chromeDocOpening.destroy();
    this._chromeDocOpening = null;
    this._pref.destroy();
    this._pref = null;
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
};

module.exports = Object.freeze({
  LinkplacesService,
});

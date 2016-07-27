/* vim: set filetype=javascript shiftwidth=2 tabstop=2 expandtab: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/**eslint-env commonjs */
"use strict";

// eslint-disable-next-line no-unused-vars
const EXPORTED_SYMBOLS = ["LinkplacesService"];

const Ci = Components.interfaces;
const Cu = Components.utils;

const TXNNAME_SAVEITEMS = "LinkplacesService:sevesItems";
const QUERY_URI = "place:queryType=1&folder=UNFILED_BOOKMARKS";
const STRING_BUNDLE_URI = "chrome://linkplaces/locale/linkplaces.properties";

const { XPCOMUtils } = Cu.import("resource://gre/modules/XPCOMUtils.jsm", {});
const { require } = Cu.import("resource://gre/modules/commonjs/toolkit/require.js", {});
const { Services } = Cu.import("resource://gre/modules/Services.jsm", {});
const {
  PlacesUtils,
  PlacesCreateBookmarkTransaction,
  PlacesAggregatedTransaction,
  PlacesRemoveItemTransaction,
} = Cu.import("resource://gre/modules/PlacesUtils.jsm", {});

/*global Bookmarks:false*/
XPCOMUtils.defineLazyModuleGetter(this, "Bookmarks", // eslint-disable-line no-invalid-this
  "resource://gre/modules/Bookmarks.jsm");
/*global PlacesTransactions:false*/
XPCOMUtils.defineLazyModuleGetter(this, "PlacesTransactions", // eslint-disable-line no-invalid-this
  "resource://gre/modules/PlacesTransactions.jsm");

/*global stringBundle:false*/
XPCOMUtils.defineLazyGetter(this, "stringBundle", function () { // eslint-disable-line no-invalid-this
  return Services.strings.createBundle(STRING_BUNDLE_URI);
});

const { ChromeDocObserver } = Cu.import("chrome://linkplaces/content/service/ChromeDocObserver.js", {});
const { PrefService } = Cu.import("chrome://linkplaces/content/service/pref.js", {});
const { LinkplacesChromePlaces } = require("./ui/LinkplacesChromePlaces.js");

/**
 * LinkplacesService
 *
 * This service provides primary methods & properties for LinkPlaces.
 */
const LinkplacesService = {

  QueryInterface: XPCOMUtils.generateQI([Ci.nsIObserver,
                                         Ci.nsISupportsWeakReference,
                                         Ci.nsISupports]),

  /**
   * @deprecated
   * @const
   *   Preference domain of this service.
   * @type {string}
   */
  get PREF_DOMAIN() {
    return this._pref.DOMAIN;
  },

  /**
   * @const
   *  The places query uri for linkplaces folder.
   * @type {string}
   */
  get QUERY_URI() {
    return QUERY_URI;
  },

  /**
   * @deprecated
   * Cache this service's preferences value.
   * @type {object}
   */
  get PREF() {
    return this._pref.PREF;
  },

  /**
   * @deprecated
   * Cache preferences service.
   * @type {nsIPrefBranch}
   */
  get prefBranch() {
    return this._pref.branch();
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
    return PlacesUtils.bookmarks.unfiledBookmarksFolder;
  },

  /**
   * Returns LinkPlaces folder's id.
   * @type {string}
   */
  get folderGuid() {
    return Bookmarks.unfiledGuid;
  },

  /**
   * Returns default inserted index in Places bookmarks.
   * @type {number}
   */
  get DEFAULT_INDEX() {
    return Bookmarks.DEFAULT_INDEX;
  },

  config() {
    return this._pref;
  },

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
  observe: function (aSubject, aTopic/*, aData*/) {
    switch (aTopic) {
      case "quit-application-granted":
        this.destroy();
        break;
    }
  },

  init: function () {
    Services.obs.addObserver(this, "quit-application-granted", true);
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
  },

  destroy: function () {
    Services.obs.removeObserver(this, "quit-application-granted");
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
   * @return {void}
   */
  saveItem: function (aURI, aTitle, aIndex) {
    const item = {
      uri  : aURI,
      title: aTitle,
    };
    this.saveItems([item], aIndex);
  },

  /**
   * Save plural items to LinkPlaces folder
   *
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
   * @return {void}
   */
  saveItems: function (aItems, aIndex = this.DEFAULT_INDEX) {
    if (this._pref.useAsyncTransactions()) {
      this._saveItemAsync(aItems, aIndex);
    }
    else {
      const containerId = this.folder;
      const transactions = aItems.map(function createTxns(item) {
        const uri = Services.io.newURI(item.uri, null, null);
        const title = item.title;
        const txn = new PlacesCreateBookmarkTransaction(uri, containerId,
                                                        aIndex, title);
        return txn;
      });

      const finalTxn = new PlacesAggregatedTransaction(TXNNAME_SAVEITEMS,
                                                     transactions);
      PlacesUtils.transactionManager.doTransaction(finalTxn);
    }
  },

  _saveItemAsync: function (aItems, aInsertionPoint) {
    const parentId = this.folderGuid;
    const txnGenarator = function* () {
      for (let item of aItems) { // eslint-disable-line prefer-const

        const uri = Services.io.newURI(item.uri, null, null);
        const title = item.title;

        const txn = new PlacesTransactions.NewBookmark({
          url: uri,
          title: title,
          parentGuid: parentId,
          index: aInsertionPoint,
        });

        yield txn.transact();
      }

      return;
    };

    return PlacesTransactions.batch(txnGenarator)
      .catch(Cu.reportError);
  },

  /**
   * Wrapper to remove the bookmark item.
   *
   * @param {number} aItemId
   *   The item's id.
   * @return {void}
   */
  removeItem: function (aItemId) {
    if (this._pref.useAsyncTransactions()) {
      this._removeItemAsync(aItemId);
    }
    else {
      const txn = new PlacesRemoveItemTransaction(aItemId);
      PlacesUtils.transactionManager.doTransaction(txn);
    }
  },

  _removeItemAsync: function (aItemId) {
    const itemId = PlacesUtils.promiseItemGuid(aItemId);
    itemId.then(function(guid){
      const txn = new PlacesTransactions.Remove({
        guid: guid,
      });

      return PlacesTransactions.batch([txn]);
    }).catch(Cu.reportError);
  },

};
LinkplacesService.init();
this.LinkplacesService = LinkplacesService; // eslint-disable-line no-invalid-this

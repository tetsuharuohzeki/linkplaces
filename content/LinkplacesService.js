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

const PREF_DOMAIN = "extensions.linkplaces.";
const TXNNAME_SAVEITEMS = "LinkplacesService:sevesItems";
const QUERY_URI = "place:queryType=1&folder=UNFILED_BOOKMARKS";
const STRING_BUNDLE_URI = "chrome://linkplaces/locale/linkplaces.properties";

const { XPCOMUtils } = Cu.import("resource://gre/modules/XPCOMUtils.jsm", {});
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

/*global prefBranch:false*/
XPCOMUtils.defineLazyGetter(this, "prefBranch", function () { // eslint-disable-line no-invalid-this
  return Services.prefs.getBranch(PREF_DOMAIN);
});
/*global stringBundle:false*/
XPCOMUtils.defineLazyGetter(this, "stringBundle", function () { // eslint-disable-line no-invalid-this
  return Services.strings.createBundle(STRING_BUNDLE_URI);
});

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
   * @const
   *   Preference domain of this service.
   * @type {string}
   */
  get PREF_DOMAIN() {
    return PREF_DOMAIN;
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
   * Cache this service's preferences value.
   * @type {object}
   */
  PREF: Object.seal({
    openLinkToWhere: "",
    focusWhenItemsOpened_Sidebar: false, // eslint-disable-line camelcase
    useAsyncTransactions: false,
  }),

  /**
   * Cache preferences service.
   * @type {nsIPrefBranch}
   */
  get prefBranch() {
    return prefBranch;
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
  observe: function (aSubject, aTopic, aData) {
    switch (aTopic) {
      case "nsPref:changed":
        this.prefObserve(aSubject, aData);
        break;
      case "quit-application-granted":
        this.destroy();
        break;
    }
  },

  prefObserve: function (aSubject, aData) {
    switch (aData) {
      case "openLinkToWhere":
        switch (prefBranch.getIntPref(aData)) {
          case 0:
            this.PREF.openLinkToWhere = "current";
            break;
          case 1:
            this.PREF.openLinkToWhere = "tab";
            break;
          case 2:
            this.PREF.openLinkToWhere = "tabshifted";
            break;
          case 3:
            this.PREF.openLinkToWhere = "window";
            break;
        }
        break;
      case "focusWhenItemsOpened.sidebar":
        this.PREF.focusWhenItemsOpened_Sidebar = prefBranch.getBoolPref(aData); // eslint-disable-line camelcase
        break;
      case "useAsyncTransactions":
        this.PREF.useAsyncTransactions = prefBranch.getBoolPref(aData);
    }
  },

  initPref: function () {
    const allPref = prefBranch.getChildList("", {});
    for (let pref of allPref) { // eslint-disable-line prefer-const
      this.prefObserve(null, pref);
    }
  },

  init: function () {
    Services.obs.addObserver(this, "quit-application-granted", true);

    //Set Preferences Observer
    prefBranch.addObserver("", this, true);
    //set user preferences
    this.initPref();
  },

  destroy: function () {
    Services.obs.removeObserver(this, "quit-application-granted");
    prefBranch.removeObserver("", this);
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
    if (this.PREF.useAsyncTransactions) {
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
    if (this.PREF.useAsyncTransactions) {
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

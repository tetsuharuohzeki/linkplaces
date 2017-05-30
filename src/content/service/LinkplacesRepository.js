/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Cu } from "chrome";

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

const QUERY_URI = "place:queryType=1&folder=UNFILED_BOOKMARKS";
const TXNNAME_SAVEITEMS = "LinkplacesService:sevesItems";

export class LinkplacesRepository {
  /**
   * @const
   *  The places query uri for linkplaces folder.
   * @type {string}
   */
  static get QUERY_URI() {
    return QUERY_URI;
  }

  /**
   * Returns LinkPlaces folder's id.
   * @returns {number}
   */
  static folder() {
    return PlacesUtils.bookmarks.unfiledBookmarksFolder;
  }

  /**
   * Returns LinkPlaces folder's id.
   * @returns {string}
   */
  static folderGuid() {
    return Bookmarks.unfiledGuid;
  }

  /**
   * Returns default inserted index in Places bookmarks.
   * @type {number}
   */
  static get DEFAULT_INDEX() {
    return Bookmarks.DEFAULT_INDEX;
  }

  /**
   * @param {Array.<{ uri:string, title:string }>} aItems
   *   The array of saved items.
   *   Items must have the following fields set:
   *   - {string} uri
   *     The item's URI.
   *   - {string} title
   *     The item's title.
   *
   * @param {number}  aIndex
   *   The index which items inserted point.
   * @return {void}
   */
  static saveItems(aItems, aIndex) {
    const containerId = LinkplacesRepository.folder();
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

  /**
   * @param {Array.<{ uri:string, title:string }>} aItems
   *   The array of saved items.
   *   Items must have the following fields set:
   *   - {string} uri
   *     The item's URI.
   *   - {string} title
   *     The item's title.
   *
   * @param {number}  aInsertionPoint
   *   The index which items inserted point.
   * @return {PromiseLike<?>}
   */
  static saveItemAsync(aItems, aInsertionPoint) {
    const parentId = LinkplacesRepository.folderGuid();
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
    };

    return PlacesTransactions.batch(txnGenarator)
      .catch(Cu.reportError);
  }

  /**
   * @param {number} aItemId
   *   The item's id.
   * @return {void}
   */
  static removeItem(aItemId) {
    const txn = new PlacesRemoveItemTransaction(aItemId);
    PlacesUtils.transactionManager.doTransaction(txn);
  }

  /**
   * @param {number} aItemId
   *   The item's id.
   * @return {PromiseLike<?>}
   */
  static removeItemAsync(aItemId) {
    const itemId = PlacesUtils.promiseItemGuid(aItemId)
      .then(function(guid){
        const txn = new PlacesTransactions.Remove({
          guid: guid,
        });

        return PlacesTransactions.batch([txn]);
      }).catch(Cu.reportError);
    return itemId;
  }
}

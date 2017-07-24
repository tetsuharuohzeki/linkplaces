/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

// @ts-check

// @ts-ignore
const { Cu } = require("chrome"); // eslint-disable-line no-undef

const { XPCOMUtils } = Cu.import("resource://gre/modules/XPCOMUtils.jsm", {});
const { Services } = Cu.import("resource://gre/modules/Services.jsm", {});
const {
  PlacesUtils,
  PlacesCreateBookmarkTransaction,
  PlacesAggregatedTransaction,
  PlacesRemoveItemTransaction,
} = Cu.import("resource://gre/modules/PlacesUtils.jsm", {});

const modGlobal = Object.create(null);

XPCOMUtils.defineLazyModuleGetter(modGlobal, "Bookmarks",
  "resource://gre/modules/Bookmarks.jsm");
XPCOMUtils.defineLazyModuleGetter(modGlobal, "PlacesTransactions",
  "resource://gre/modules/PlacesTransactions.jsm");

export const QUERY_URI = "place:queryType=1&folder=UNFILED_BOOKMARKS";
const TXNNAME_SAVEITEMS = "LinkplacesService:sevesItems";

/**
 * Returns LinkPlaces folder's id.
 * @returns {string}
 */
function folderGuid() {
  return modGlobal.Bookmarks.unfiledGuid;
}

/**
 * Returns default inserted index in Places bookmarks.
 * @returns {number}
 */
export function getDefaultIndex() {
  return modGlobal.Bookmarks.DEFAULT_INDEX;
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
 * @return {Promise<void>}
 */
export async function saveItems(aItems, aIndex) {
  const containerId = await PlacesUtils.promiseItemId(modGlobal.Bookmarks.unfiledGuid);
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
 * @return {Promise<?>}
 */
export function saveItemAsync(aItems, aInsertionPoint) {
  const parentId = folderGuid();
  const txns = aItems.map(({ title, uri }) => {
    const url = Services.io.newURI(uri, null, null);
    const txn = new modGlobal.PlacesTransactions.NewBookmark({
      url,
      title,
      parentGuid: parentId,
      index: aInsertionPoint,
    });
    return txn;
  });
  return modGlobal.PlacesTransactions.batch(txns)
    .catch(Cu.reportError);
}

/**
 * @param {number} aItemGuid
 *   The item's guid.
 * @return {Promise<?>}
 */
export function removeItem(aItemGuid) {
  const id = PlacesUtils.promiseItemId(aItemGuid);
  // @ts-ignore
  const txn = id.then((id) => {
    const txn = new PlacesRemoveItemTransaction(id);
    return txn;
  });
  // @ts-ignore
  const finalTxn = txn.then((txn) => {
    const finalTxn = PlacesUtils.transactionManager.doTransaction(txn);
    return finalTxn;
  });
  return finalTxn.catch(Cu.reportError);
}

/**
 * @param {number} aItemGuid
 *   The item's guid.
 * @return {Promise<?>}
 */
export function removeItemAsync(aItemGuid) {
  const txn = new modGlobal.PlacesTransactions.Remove({
    guid: aItemGuid,
  });

  return modGlobal.PlacesTransactions.batch([txn]);
}

/**
 * Get the item id for an item (a bookmark, a folder or a separator) given
 * its unique id.
 *
 * @param {string}  aGuid
 *        an item GUID
 * @return {Promise<number>}
 *  @resolves to the GUID.
 *  @rejects if there's no item for the given GUID.
 */
export function getItemId(aGuid) {
  const id = PlacesUtils.promiseItemId(aGuid);
  return id;
}

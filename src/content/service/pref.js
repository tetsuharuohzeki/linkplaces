/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Ci, Cu } from "chrome";

const { XPCOMUtils } = Cu.import("resource://gre/modules/XPCOMUtils.jsm", {});
const { Services } = Cu.import("resource://gre/modules/Services.jsm", {});

const PREF_DOMAIN = "extensions.linkplaces.";

class PrefTable {
  constructor() {
    this.focusSidebarWhenOpenItems = false;
    Object.seal(this);
  }
}

export class PrefService {
  constructor() {
    this._prefBranch = Services.prefs.getBranch(PREF_DOMAIN);
    this._table = new PrefTable();
    this.QueryInterface = XPCOMUtils.generateQI([
      Ci.nsIObserver,
      Ci.nsISupportsWeakReference,
      Ci.nsISupports,
    ]);

    this._listenerSet = new Set();

    Object.seal(this);
    this._init();
  }

  destroy() {
    this._prefBranch.removeObserver("", this);

    this._listenerSet.clear();
    this._listenerSet = null;

    this.QueryInterface = null;
    this._table = null;
    this._prefBranch = null;
  }

  DOMAIN() {
    return PREF_DOMAIN;
  }

  branch() {
    return this._prefBranch;
  }

  shouldFocusOnSidebarWhenOpenItem() {
    return this._table.focusSidebarWhenOpenItems;
  }

  _init() {
    this._prefBranch.addObserver("", this, true);
    const allPref = this._prefBranch.getChildList("", {});
    for (let pref of allPref) { // eslint-disable-line prefer-const
      this._prefObserve(pref);
    }

    this._prefObserve("");
  }

  _prefObserve(aData) {
    const table = this._table;
    switch (aData) {
      case "focusSidebarWhenOpenItem": {
        const value = this._prefBranch.getBoolPref(aData);
        table.focusSidebarWhenOpenItems = value;
        break;
      }
    }

    this._callListeners(aData, table);
  }

  _callListeners(aName, aTable) {
    for (const listener of this._listenerSet) {
      listener(aName, aTable);
    }
  }

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
  observe(aSubject, aTopic, aData) {
    switch (aTopic) {
      case "nsPref:changed":
        this._prefObserve(aData);
        break;
    }
  }

  addListener(aListener) {
    this._listenerSet.add(aListener);
  }

  removeListener(aListener) {
    this._listenerSet.delete(aListener);
  }
}

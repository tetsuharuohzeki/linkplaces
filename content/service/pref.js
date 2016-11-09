/* vim: set filetype=javascript shiftwidth=2 tabstop=2 expandtab: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*eslint-env commonjs */

"use strict";

// eslint-disable-next-line no-unused-vars
const EXPORTED_SYMBOLS = ["PrefService"];

const Ci = Components.interfaces;
const Cu = Components.utils;

const { XPCOMUtils } = Cu.import("resource://gre/modules/XPCOMUtils.jsm", {});
const { Services } = Cu.import("resource://gre/modules/Services.jsm", {});

const PREF_DOMAIN = "extensions.linkplaces.";

class PrefTable {
  constructor() {
    this._openLinkToWhere = "tab";
    this.focusSidebarWhenOpenItems = false;
    this.useAsyncTransactions = false;
    Object.seal(this);
  }

  get openLinkToWhere() {
    return this._openLinkToWhere;
  }

  set openLinkToWhere(v) {
    switch (v) {
      case 0:
        this._openLinkToWhere = "current";
        break;
      case 1:
        this._openLinkToWhere = "tab";
        break;
      case 2:
        this._openLinkToWhere = "tabshifted";
        break;
      case 3:
        this._openLinkToWhere = "window";
        break;
      default:
        throw new Error("found undefined value");
    }
  }
}

class PrefService {
  constructor() {
    this._prefBranch = Services.prefs.getBranch(PREF_DOMAIN);
    this._table = new PrefTable();
    this.QueryInterface = XPCOMUtils.generateQI([
      Ci.nsIObserver,
      Ci.nsISupportsWeakReference,
      Ci.nsISupports,
    ]);
    Object.seal(this);
    this._init();
  }

  destroy() {
    this._prefBranch.removeObserver("", this);
    this.QueryInterface = null;
    this._table = null;
    this._prefBranch = null;
  }

  PREF() {
    return this._table;
  }

  DOMAIN() {
    return PREF_DOMAIN;
  }

  branch() {
    return this._prefBranch;
  }

  openLinkTo() {
    return this._table.openLinkToWhere;
  }

  shouldFocusOnSidebarWhenOpenItem() {
    return this._table.focusSidebarWhenOpenItems;
  }

  useAsyncTransactions() {
    return this._table.useAsyncTransactions;
  }

  _init() {
    this._prefBranch.addObserver("", this, true);
    const allPref = this._prefBranch.getChildList("", {});
    for (let pref of allPref) { // eslint-disable-line prefer-const
      this._prefObserve(pref);
    }
  }

  _prefObserve(aData) {
    const table = this._table;
    switch (aData) {
      case "openLinkToWhere": {
        const value = this._prefBranch.getIntPref(aData);
        table.openLinkToWhere = value;
        break;
      }
      case "focusSidebarWhenOpenItem": {
        const value = this._prefBranch.getBoolPref(aData);
        table.focusSidebarWhenOpenItems = value;
        break;
      }
      case "useAsyncTransactions": {
        const value = this._prefBranch.getBoolPref(aData);
        table.useAsyncTransactions = value;
        break;
      }
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
}

this.PrefService = PrefService; // eslint-disable-line no-invalid-this

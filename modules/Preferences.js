/**
 * Preferences
 * This is enable to write the style like "resource://services-sync/ext/Preferences.js".
 *
 * @License     MPL 1.1/GPL 2.0/LGPL 2.1
 * @developer   saneyuki_s
 * @version     20111127.1
 */

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;

Cu.import("resource://gre/modules/Services.jsm");

let EXPORTED_SYMBOLS = ["Preferences"];

function Preferences(aPrefBranch) {
	if (aPrefBranch) {
		this.prefBranch = aPrefBranch;
	}
}
Preferences.prototype = {

	prefBranch: "",

	_prefSvc: null,
	get prefSvc() {
		if (!this._prefSvc) {
			this._prefSvc = Services.prefs.getBranch(this.prefBranch)
			                .QueryInterface(Ci.nsIPrefBranch2);
		}
		return this._prefSvc;
	},

	get: function (aPrefName) {
		if (aPrefName instanceof Array) {
			return aPrefName.map(function(v){ return this._get(v); }, this);
		}
		else {
			return this._get(aPrefName);
		}
	},

	_get: function (aPrefName) {
		let prefSvc = this.prefSvc;
		switch (prefSvc.getPrefType(aPrefName)) {
			case Ci.nsIPrefBranch.PREF_STRING:
				return prefSvc.getComplexValue(aPrefName, Ci.nsISupportsString).data;

			case Ci.nsIPrefBranch.PREF_INT:
				return prefSvc.getIntPref(aPrefName);

			case Ci.nsIPrefBranch.PREF_BOOL:
				return prefSvc.getBoolPref(aPrefName);
		}
	},

	set: function (aPrefName, aPrefValue) {
		let prefSvc = this.prefSvc;
		let PrefType = typeof aPrefValue;

		switch (PrefType) {
			case "string":
				let str = Cc["@mozilla.org/supports-string;1"]
				          .createInstance(Ci.nsISupportsString);
				str.data = aPrefValue;
				prefSvc.setComplexValue(aPrefName, Ci.nsISupportsString, str);
				break;

			case "number":
				prefSvc.setIntPref(aPrefName, aPrefValue);
				break;

			case "boolean":
				prefSvc.setBoolPref(aPrefName, aPrefValue);
				break;
		}
	},

	reset: function (aPrefName) {
		this.prefSvc.clearUserPref(aPrefName);
	},

	resetBranch: function(aPrefBranch) {
		this.prefSvc.resetBranch(aPrefBranch);
	},

	getChildList: function(aPrefBranch) {
		return this.prefSvc.getChildList(aPrefBranch, {});
	},

	addObserver: function (aPrefBranch, aObsObj) {
		this.prefSvc.addObserver(aPrefBranch, aObsObj, true);
	},

	removeObserver: function (aPrefBranch, aObsObj) {
		this.prefSvc.removeObserver(aPrefBranch, aObsObj);
	},
};
Preferences.__proto__ = Preferences.prototype;

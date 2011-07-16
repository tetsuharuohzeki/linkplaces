/**
 * Preferences
 * This is enable to write the style like "resource://services-sync/ext/Preferences.js".
 *
 * @License     MPL 1.1/GPL 2.0/LGPL 2.1
 * @developer   saneyuki_s
 * @version     20110716.1
 */

Components.utils.import("resource://gre/modules/Services.jsm");

let EXPORTED_SYMBOLS = ["Preferences"];

function Preferences(aPrefBranch) {
	if (aPrefBranch) {
		this._prefBranch = aPrefBranch;
	}
}
Preferences.prototype = {

	_prefBranch: "",

	_prefSvc: null,
	get prefSvc() {
		if (!this._prefSvc) {
			this._prefSvc = Services.prefs.getBranch(this._prefBranch)
			                .QueryInterface(Components.interfaces.nsIPrefBranch2);
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
		switch (this.prefSvc.getPrefType(aPrefName)) {
			case Components.interfaces.nsIPrefBranch.PREF_STRING:
				return this.prefSvc.getComplexValue(aPrefName, Components.interfaces.nsISupportsString).data;

			case Components.interfaces.nsIPrefBranch.PREF_INT:
				return this.prefSvc.getIntPref(aPrefName);

			case Components.interfaces.nsIPrefBranch.PREF_BOOL:
				return this.prefSvc.getBoolPref(aPrefName);
		}
	},

	set: function (aPrefName, aPrefValue) {
		let prefSvc = this.prefSvc;
		let PrefType = typeof aPrefValue;

		switch (PrefType) {
			case "string":
				let str = Components.classes["@mozilla.org/supports-string;1"]
				          .createInstance(Components.interfaces.nsISupportsString);
				str.data = aPrefValue;
				prefSvc.setComplexValue(aPrefName, Components.interfaces.nsISupportsString, str);
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

	observe: function (aPrefBranch, aObsObj) {
		this.prefSvc.addObserver(aPrefBranch, aObsObj, false);
	},

	ignore: function (aPrefBranch, aObsObj) {
		this.prefSvc.removeObserver(aPrefBranch, aObsObj);
	},
};
Preferences.__proto__ = Preferences.prototype;

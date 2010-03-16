var EXPORTED_SYMBOLS = ["LinkplacesService"];

//Import JS Utils module
Components.utils.import("resource://linkplaces/Utils.js");

var LinkplacesService = {

	PREF_DOMAIN: "extensions.linkplaces.",

	PREF: {
		openLinkToWhere: null,
		content_savePage: null,
		content_saveLink: null,
	},

	_prefBranch: null,
	get prefBranch() {
		if (!this._prefBranch) {
			this._prefBranch = new Preferences(this.PREF_DOMAIN);
		}
		return this._prefBranch;
	},

	_bookmarksSvc: null,
	get bookmarksSvc() {
		if (!this._bookmarksSvc) {
			this._bookmarksSvc = Components.classes["@mozilla.org/browser/nav-bookmarks-service;1"]
			                     .getService(Components.interfaces.nsINavBookmarksService);
		}
		return this._bookmarksSvc;
	},

	_unfiledBookmarksFolder: null,
	get unfiledBookmarksFolder() {
		if (!this._unfiledBookmarksFolder) {
			this._unfiledBookmarksFolder = this.bookmarksSvc.unfiledBookmarksFolder;
		}
		return this._unfiledBookmarksFolder;
	},

	_IOService: null,
	get IOService() {
		if (!this._IOService) {
			this._IOService = Components.classes["@mozilla.org/network/io-service;1"]
			                  .getService(Components.interfaces.nsIIOService);
		}
		return this._IOService;
	},

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
		var value = this.prefBranch.get(aData);
		switch (aData) {
			case "openLinkToWhere":
				switch (value) {
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
			case "content.savePage":
				this.PREF.content_savePage = value;
				break;
			case "content.saveLink":
				this.PREF.content_saveLink = value;
				break;
		}
	},

	initPref: function () {
		var allPref = this.prefBranch.prefSvc.getChildList("", {});
		allPref.forEach(function(aPref) {
			this.prefObserve(null, aPref);
		}, this);
	},

	init: function () {
		Observers.add("quit-application-granted", this);

		//Set Preferences Observer
		this.prefBranch.observe("", this);
		//set user preferences
		this.initPref();
	},

	destroy: function () {
		Observers.remove("quit-application-granted", this);
		this.prefBranch.ignore("", this);
	},

	saveItem: function (aURI, aTitle, aIndex) {
		var uri = this.IOService.newURI(aURI, null, null);
		if (!aIndex) {
			aIndex = -1;
		}
		this.bookmarksSvc.insertBookmark(this.unfiledBookmarksFolder, uri,
		                                 aIndex, aTitle);
	},

	removeItem: function (aItemId) {
		this.bookmarksSvc.removeItem(aItemId);
	},
};
LinkplacesService.init();
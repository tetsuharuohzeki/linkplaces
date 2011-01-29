var EXPORTED_SYMBOLS = ["LinkplacesService"];

//Import JS Utils module
Components.utils.import("resource://linkplaces/UtilsForExtension.js");

var LinkplacesService = {

	PREF_DOMAIN: "extensions.linkplaces.",

	PREF: {
		openLinkToWhere: null,
		focusWhenItemsOpened_Sidebar: null,
	},

	get prefBranch() {
		delete this.prefBranch;
		return this.prefBranch = new Preferences(this.PREF_DOMAIN);
	},

	get bookmarksSvc() {
		delete this.bookmarksSvc;
		return this.bookmarksSvc = Components.classes["@mozilla.org/browser/nav-bookmarks-service;1"]
		                           .getService(Components.interfaces.nsINavBookmarksService);
	},

	get linkplacesFolder() {
		delete this.linkplacesFolder;
		return this.linkplacesFolder = this.bookmarksSvc.unfiledBookmarksFolder;
	},

	get linkplacesFolder_DEFAULT_INDEX () {
		delete this.linkplacesFolder_DEFAULT_INDEX;
		return this.linkplacesFolder_DEFAULT_INDEX = this.bookmarksSvc.DEFAULT_INDEX;
	},

	get historySvc() {
		delete this.historySvc;
		return this.historySvc = Components.classes["@mozilla.org/browser/nav-history-service;1"]
		                         .getService(Components.interfaces.nsINavHistoryService);
	},

	get IOService() {
		delete this.IOService;
		return this.IOService = Components.classes["@mozilla.org/network/io-service;1"]
		                        .getService(Components.interfaces.nsIIOService);
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
			case "focusWhenItemsOpened.sidebar":
				this.PREF.focusWhenItemsOpened_Sidebar = value;
				break;
		}
	},

	initPref: function () {
		var allPref = this.prefBranch.getChildList("");
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
			aIndex = this.linkplacesFolder_DEFAULT_INDEX;
		}
		this.bookmarksSvc.insertBookmark(this.linkplacesFolder, uri,
		                                 aIndex, aTitle);
	},

	removeItem: function (aItemId) {
		this.bookmarksSvc.removeItem(aItemId);
	},

};
LinkplacesService.init();
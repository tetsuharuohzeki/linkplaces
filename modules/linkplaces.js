var EXPORTED_SYMBOLS = ["LinkplacesService"];

var LinkplacesService = {

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

	init: function () {
		//Import JS Utils module
		Components.utils.import("resource://linkplaces/Utils.js");
	},

	destroy: function () {
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
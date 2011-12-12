let EXPORTED_SYMBOLS = ["LinkplacesService"];

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;

const PREF_DOMAIN = "extensions.linkplaces.";

//Import JS Utils module
Cu.import("resource://gre/modules/XPCOMUtils.jsm");
Cu.import("resource://gre/modules/Services.jsm");
Cu.import("resource://linkplaces/Preferences.js");

/**
 * LinkplacesService
 *
 * This service provides primary methods & properties for LinkPlaces.
 */
let LinkplacesService = {

	QueryInterface: XPCOMUtils.generateQI([Ci.nsIObserver,
	                                       Ci.nsISupportsWeakReference,
	                                       Ci.nsISupports]),

	/**
	 * @constant
	 *   Preference domain of this service.
	 * @type string
	 */
	get PREF_DOMAIN () {
		return PREF_DOMAIN;
	},

	/**
	 * Cache this service's preferences value.
	 * @type object
	 */
	PREF: {
		openLinkToWhere: null,
		focusWhenItemsOpened_Sidebar: null,
	},

	/**
	 * Cache preferences service.
	 */
	get prefBranch () {
		delete this.prefBranch;
		return this.prefBranch = new Preferences(PREF_DOMAIN);
	},

	/**
	 * Cache nsINavBookmarksService.
	 */
	get bookmarksSvc () {
		delete this.bookmarksSvc;
		return this.bookmarksSvc = Cc["@mozilla.org/browser/nav-bookmarks-service;1"]
		                           .getService(Ci.nsINavBookmarksService);
	},

	/**
	 * Returns LinkPlaces folder's id.
	 * @type number
	 */
	get folder () {
		delete this.folder;
		return this.folder = this.bookmarksSvc.unfiledBookmarksFolder;
	},

	/**
	 * Returns default inserted index in Places bookmarks.
	 * @type number
	 */
	get DEFAULT_INDEX () {
		delete this.DEFAULT_INDEX;
		return this.DEFAULT_INDEX = this.bookmarksSvc.DEFAULT_INDEX;
	},

	/**
	 * Cache nsINavHistoryService.
	 */
	get historySvc () {
		delete this.historySvc;
		return this.historySvc = Cc["@mozilla.org/browser/nav-history-service;1"]
		                         .getService(Ci.nsINavHistoryService);
	},

	/**
	 * Observer method.
	 *
	 * @params {nsISupports} aSubject
	 *   In general reflects the object whose change or action is being observed.
	 * @params {string}      aTopic
	 *   Indicates the specific change or action.
	 * @params {wstring}     aData
	 *   An optional parameter or other auxiliary data further describing the change or action.
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

	/**
	 * Set pref values to cache.
	 */
	prefObserve: function (aSubject, aData) {
		let value = this.prefBranch.get(aData);
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

	/**
	 * Initialize cache of preferences
	 */
	initPref: function () {
		let allPref = this.prefBranch.getChildList("");
		allPref.forEach(function(aPref) {
			this.prefObserve(null, aPref);
		}, this);
	},

	/**
	 * Initialize this service. This methods must be called before using this service.
	 */
	init: function () {
		Services.obs.addObserver(this, "quit-application-granted", true);

		//Set Preferences Observer
		this.prefBranch.addObserver("", this);
		//set user preferences
		this.initPref();
	},

	/**
	 * Unregister this object from observer.
	 */
	destroy: function () {
		Services.obs.removeObserver(this, "quit-application-granted");
		this.prefBranch.removeObserver("", this);
	},


	/**
	 * Save item to LinkPlaces folder
	 *
	 * @params {string} aURI
	 *   The item's URI.
	 * @params {string} aTitle
	 *   The item's title.
	 * @params {number} aIndex (optional)
	 *   The index which item inserted point.
	 */
	saveItem: function (aURI, aTitle, aIndex) {
		let uri = Services.io.newURI(aURI, null, null);
		if (!aIndex) {
			aIndex = this.DEFAULT_INDEX;
		}
		this.bookmarksSvc.insertBookmark(this.folder, uri,
		                                 aIndex, aTitle);
	},

	/**
	 * Wrapper to remove the bookmark item.
	 *
	 * @params {number} aItemId
	 *   The item's id.
	 */
	removeItem: function (aItemId) {
		this.bookmarksSvc.removeItem(aItemId);
	},

};
LinkplacesService.init();
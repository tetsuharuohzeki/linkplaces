/* vim: set filetype=javascript shiftwidth=4 tabstop=4 noexpandtab: */

"use strict";

var LinkplacesMultipleTab = {

	ElmId_tabCtxSaveTab: "linkplaces-tabCtx-saveTab",

	get service () {
		delete this.service;
		Components.utils.import("resource://linkplaces/linkplaces.js");
		return this.service = LinkplacesService;
	},

	handleEvent: function (aEvent) {
		switch (aEvent.type) {
			case "load":
				this.onLoad();
				break;
		}
	},

	onLoad: function () {
		window.removeEventListener("load", this, false);

		this.deleteItemFromTabCtx();
	},

	deleteItemFromTabCtx: function () {
		let tabContextMenu = gBrowser.tabContextMenu;
		let menuitem = document.getElementById(this.ElmId_tabCtxSaveTab);
		tabContextMenu.removeChild(menuitem);
	},

	saveSelectedTabs: function () {
		let items = MultipleTabService.getSelectedTabs().map(function(aTab){
			let browser = aTab.linkedBrowser;
			let uri     = browser.currentURI.spec
			let title   = browser.contentDocument.title || uri;
			return { uri: uri, title:title };
		}, this);
		this.service.saveItems(items);
	},
};
window.addEventListener("load", LinkplacesMultipleTab, false);

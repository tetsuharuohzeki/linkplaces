var LinkplacesMultipleTab = {

	ElmId_tabCtxSaveTab: "linkplaces-tabCtx-saveTab",

	get browserOverlay() {
		delete this.browserOverlay;
		return this.browserOverlay = LinkplacesOverlay;
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
		var tabContextMenu = document.getAnonymousElementByAttribute(gBrowser, "anonid", "tabContextMenu") ||
		                     gBrowser.tabContextMenu;
		var menuitem = document.getElementById(this.ElmId_tabCtxSaveTab);
		tabContextMenu.removeChild(menuitem);
	},

	saveSelectedTabs: function () {
		MultipleTabService.getSelectedTabs().forEach(function(aTab){
			this.browserOverlay.saveTab(aTab);
		}, this);
	},
};
window.addEventListener("load", LinkplacesMultipleTab, false);
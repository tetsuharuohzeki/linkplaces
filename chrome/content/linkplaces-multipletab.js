var LinkplacesMultipleTab = {

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
		var tabContextMenu = document.getAnonymousElementByAttribute(gBrowser, "anonid", "tabContextMenu");
		var menuitem = document.getElementById("linkplaces-tabCtx-saveTab");
		tabContextMenu.removeChild(menuitem);
	},

	saveSelectedTabs: function () {
		MultipleTabService.getSelectedTabs().forEach(function(aTab){
			LinkplacesOverlay.saveTab(aTab);
		});
	},
};
window.addEventListener("load", LinkplacesMultipleTab, false);
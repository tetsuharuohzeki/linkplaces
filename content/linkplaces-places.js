/* vim: set filetype=javascript shiftwidth=4 tabstop=4 noexpandtab: */

var LinkplacesPlaces = {

	get service () {
		delete this.service;
		Components.utils.import("resource://linkplaces/linkplaces.js");
		return this.service = LinkplacesService;
	},

	get ctxMenu () {
		delete this.ctxMenu;
		return this.ctxMenu = document.getElementById("placesContext");
	},
	set ctxMenu (v) {},

	handleEvent: function (aEvent) {
		switch (aEvent.type) {
			case "load":
				this.onLoad();
				break;
			case "unload":
				this.onUnLoad();
				break;
		}
	},

	onLoad: function () {
		window.removeEventListener("load", this, false);

		window.addEventListener("unload",  this, false);
	},

	onUnLoad: function () {
		window.removeEventListener("unload", this, false);

		this.ctxMenu = null;
	},

	saveAllItems: function () {
		let triggerNode = this.ctxMenu.triggerNode;
		let nodesArray = PlacesUIUtils.getViewForNode(triggerNode).selectedNodes;
		let items = [];
		for (let node of nodesArray) {
			if (PlacesUtils.nodeIsURI(node)) {
				items.push({
					uri  : node.uri,
					title: node.title,
				});
			}
		}
		this.service.saveItems(items);
	},

};
window.addEventListener("load", LinkplacesPlaces, false);

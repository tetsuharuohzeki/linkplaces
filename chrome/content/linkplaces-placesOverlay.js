var LinkplacesPlacesOverlay = {

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
		for (let i = 0, length = nodesArray.length; i < length; i++) {
			this._saveItem(nodesArray[i]);
		}
	},

	_saveItem: function (aNode) {
		if (PlacesUtils.nodeIsURI(aNode)) {
			this.service.saveItem(aNode.uri, aNode.title);
		}
	},

};
window.addEventListener("load", LinkplacesPlacesOverlay, false);
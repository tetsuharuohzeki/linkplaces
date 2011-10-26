var LinkplacesPlacesOverlay = {

	get service () {
		delete this.service;
		Components.utils.import("resource://linkplaces/linkplaces.js", this);
		return this.service = this.LinkplacesService;
	},

	get ctxMenu () {
		delete this.ctxMenu;
		return this.ctxMenu = document.getElementById("placesContext");
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
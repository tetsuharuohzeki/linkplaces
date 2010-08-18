var LinkplacesPlacesOverlay = {

	get service() {
		delete this.service;
		return this.service = this.LinkplacesService;
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

		// Import JavaScript Compornent code module
		Components.utils.import("resource://linkplaces/linkplaces.js", this);
	},

	saveAllItems: function () {
		var nodesArray = PlacesUIUtils.getViewForNode(document.popupNode).selectedNodes;
		for (var i = 0; i < nodesArray.length; i++) {
			this._saveItem(nodesArray[i]);
		}
	},

	_saveItem: function (aNode) {
		if (PlacesUtils.nodeIsURI(aNode)) {
			this.service.saveItem(aNode.uri, aNode.title, -1);
		}
	},

};
window.addEventListener("load", LinkplacesPlacesOverlay, false);
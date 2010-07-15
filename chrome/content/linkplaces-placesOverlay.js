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

	saveContext: function () {
		var node = PlacesUIUtils.getViewForNode(document.popupNode).selectedNode;

		if (node && PlacesUtils.nodeIsURI(node)) {
			if (!PlacesUIUtils.checkURLSecurity(node)) {
				return;
			}

			this.service.saveItem(node.uri, node.title, -1);
		}
	},
};
window.addEventListener("load", LinkplacesPlacesOverlay, false);
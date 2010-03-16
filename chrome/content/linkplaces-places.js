var LinkplacesPlaces = {

	get service() {
		return LinkplacesService;
	},

	handleEvent: function (aEvent) {
		switch (aEvent.type) {
			case "load":
				this.onLoad();
				break;
		}
	},

	onLoad: function Linkpad_onLoad() {
		window.removeEventListener("load", this, false);

		// Import JavaScript Compornent code module
		Components.utils.import("resource://linkplaces/linkplaces.js");
	},

	saveContext: function Linkpad_saveContext() {
		var node = PlacesUIUtils.getViewForNode(document.popupNode).selectedNode;
/*
		if (node && PlacesUtils.nodeIsURI(node) && !PlacesUIUtils.checkURLSecurity(node)) {
			return;
		}

		if (node && PlacesUtils.nodeIsURI(node)) {
			this.service.saveItem(node.uri, node.title, -1);
		}
*/
		if (node && PlacesUtils.nodeIsURI(node)) {
			if (!PlacesUIUtils.checkURLSecurity(node)) {
				return;
			}

			this.service.saveItem(node.uri, node.title, -1);
		}
	},
};
window.addEventListener("load", LinkplacesPlaces, false);
var LinkplacesPanel = {

	get treeView() {
		delete this.treeView;
		return this.treeView = document.getElementById("linkplaces-view");
	},

	get service() {
		delete this.service;
		Components.utils.import("resource://linkplaces/linkplaces.js", this);
		return this.service = this.LinkplacesService;
	},

	get PREF() {
		delete this.PREF;
		return this.PREF = this.service.PREF;
	},

	get placesController() {
		delete this.placesController;
		var self = this;
		this.placesController = new PlacesController(this.treeView);
		this.placesController._doCommand = this.placesController.doCommand;
		this.placesController.doCommand = function (aCmd) {
			this._doCommand(aCmd);
			switch (aCmd) {
				case "placesCmd_open":
				case "placesCmd_open:window":
				case "placesCmd_open:tab":
					self.focusSidebarWhenItemsOpened();
					self.service.removeItem(this._view.selectedNode.itemId);
					break;
			}
		};
		return this.placesController;
	},

	handleEvent: function (aEvent) {
		switch (aEvent.type) {
			case "load":
				this.onLoad();
				break;
			case "unload":
				this.onUnLoad();
				break;
			case "SidebarFocused":
				this.onSidebarFocused();
				break;
		}
	},

	onLoad: function () {
		window.removeEventListener("load", this, false);
		window.addEventListener("unload", this, false);
		window.addEventListener("SidebarFocused", this, false);

		this.treeView.controllers.appendController(this.placesController);
		this.initPlacesView();
	},

	onUnLoad: function() {
		window.removeEventListener("unload", this, false);
		window.removeEventListener("SidebarFocused", this, false);

		this.treeView.controllers.removeController(this.placesController);
		//delete this.placesController;

		this.setMouseoverURL("");
	},

	onSidebarFocused: function () {
		this.treeView.focus();
	},

	initPlacesView: function() {
		var historySvc = this.service.historySvc;

		var query = historySvc.getNewQuery();
		var linkplacesFolder = this.service.linkplacesFolder;
		query.setFolders([linkplacesFolder], 1);
		//query.searchTerms = "";
		query.onlyBookmarked = true;

		var queryOpts = historySvc.getNewQueryOptions();
		queryOpts.queryType = queryOpts.QUERY_TYPE_BOOKMARKS;//queryType=1

		var placesQuery = historySvc.queriesToQueryString([query], 1, queryOpts);

		this.treeView.place = placesQuery;
	},

	// Based on "chrome://browser/content/bookmarks/sidebarUtils.js"
	handleTreeClick: function (aEvent, aGutterSelect) {
		// When right button click
		if (aEvent.button == 2) {
			return;
		}

		var tree = aEvent.target.parentNode;
		var treeBoxObj = tree.treeBoxObject;
		var row = {}, col = {}, obj = {};
		treeBoxObj.getCellAt(aEvent.clientX, aEvent.clientY, row, col, obj);

		if (row.value == -1 ||  obj.value == "twisty") {
			return;
		}

		// whether mouse in opening item area or not.
		var mouseInGutter = false;
		var cellX = {}, cellY = {}, cellW = {}, cellH = {};
		if (aGutterSelect) {
			treeBoxObj.getCoordsForCellItem(row.value, col.value, "image", cellX, cellY, cellW, cellH);

			var isRTL = (window.getComputedStyle(tree, null).direction == "rtl");
			if (isRTL) {
				mouseInGutter = (aEvent.clientX > cellX.value);
			}
			else {
				mouseInGutter = (aEvent.clientX < cellX.value);
			}
		}

		var modifKey = (aEvent.ctrlKey || aEvent.metaKey) || aEvent.shiftKey;
		var isContainer = treeBoxObj.view.isContainer(row.value);
		var openInTabs = isContainer &&// Is the node container?
		                 // Is event is middle-click, or left-click with ctrlkey?
		                 (aEvent.button == 1 || (aEvent.button == 0 && modifKey)) &&
		                 //Does the node have child URI node?
		                 PlacesUtils.hasChildURIs(treeBoxObj.view.nodeForTreeIndex(row.value));

		if (aEvent.button == 0 && isContainer && !openInTabs) {
			treeBoxObj.view.toggleOpenState(row.value);
			return;
		}
		else if (!mouseInGutter && aEvent.originalTarget.localName == "treechildren") {
			if (openInTabs) {
				treeBoxObj.view.selection.select(row.value);
				PlacesUIUtils.openContainerNodeInTabs(tree.selectedNode, aEvent);
				this.focusSidebarWhenItemsOpened();
				this.service.removeItem(tree.selectedNode.itemId);
			}
			else if (!isContainer) {
				treeBoxObj.view.selection.select(row.value);
				this.openNodeWithEvent(tree.selectedNode, aEvent);
			}
		}
	},

	handleTreeKeyPress: function (aEvent) {
		if (aEvent.keyCode == KeyEvent.DOM_VK_RETURN) {
			var node = aEvent.target.selectedNode;
			if (PlacesUtils.nodeIsURI(node)) {
				this.openNodeWithEvent(node, aEvent);
			}
		}
	},

	handleTreeMouseMove: function (aEvent) {
		if (aEvent.target.localName != "treechildren") {
			return;
		}

		var tree = aEvent.target.parentNode;
		var treeBoxObj = tree.treeBoxObject;
		var row = {}, col = {}, obj = {};
		treeBoxObj.getCellAt(aEvent.clientX, aEvent.clientY, row, col, obj);

		if (row.value != -1) {
			var node = tree.view.nodeForTreeIndex(row.value);
			if (PlacesUtils.nodeIsURI(node)) {
				this.setMouseoverURL(node.uri);
			}
			else {
				this.setMouseoverURL("");
			}
		}
		else {
			this.setMouseoverURL("");
		}
	},

	setMouseoverURL: function (aURI) {
		window.top.XULBrowserWindow.setOverLink(aURI, null);
	},

	openNodeWithEvent: function (aNode, aEvent) {
		var where = this.isBookmarklet(aNode.uri) ? "current" : this.whereToOpenLink(aEvent);

		PlacesUIUtils.openNodeIn(aNode, where);

		this.focusSidebarWhenItemsOpened();

		this.service.removeItem(aNode.itemId);
	},

	whereToOpenLink: function (aEvent) {
		var where = whereToOpenLink(aEvent);
		switch (where) {
			case "current":
				return this.PREF.openLinkToWhere;
			default: 
				return where;
		}
	},

	regExpIsBookmarklet: /^javascript:/,
	isBookmarklet: function (aURI) {
		return this.regExpIsBookmarklet.test(aURI);
	},

	openSelectionInTabs: function(aController, aEvent) {
		aController.openSelectionInTabs(aEvent);

		this.focusSidebarWhenItemsOpened();

		if (aController && aController.isCommandEnabled("placesCmd_delete")) {
			aController.doCommand("placesCmd_delete");
		}
	},

	focusSidebarWhenItemsOpened: function () {
		if (this.PREF.focusSidebarWhenItemsOpened) {
			this.treeView.focus();
		}
	},

};
window.addEventListener("load", LinkplacesPanel, false);

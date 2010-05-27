var LinkplacesPanel = {

	_treeView: null,
	get treeView() {
		if (!this._treeView) {
			this._treeView = document.getElementById("linkplaces-view");
		}
		return this._treeView;
	},

	get service() {
		return LinkplacesService;
	},

	get PREF() {
		return this.service.PREF;
	},

	placesController: null,

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

		//Import JS Utils module
		Components.utils.import("resource://linkplaces/linkplaces.js");

		this.overrideCommands();
		this.initPlacesView();
	},

	initPlacesView: function() {
		var query = this.service.historySvc.getNewQuery();
		var linkplacesFolder = this.service.linkplacesFolder;
		query.setFolders([linkplacesFolder], 1);
		//query.searchTerms = "";
		query.onlyBookmarked = true;

		var queryOpts = this.service.historySvc.getNewQueryOptions();
		queryOpts.queryType = queryOpts.QUERY_TYPE_BOOKMARKS;//queryType=1

		var placesQuery = this.service.historySvc.queriesToQueryString([query], 1, queryOpts);

		this.treeView.place = placesQuery;
	},

	overrideCommands: function () {
		this.placesController = new PlacesController(this.treeView);
		this.placesController.linkplaces = this;
		this.placesController._doCommand = this.placesController.doCommand;
		this.placesController.doCommand = function (aCmd) {
			switch (aCmd) {
				case "placesCmd_open":
					PlacesUIUtils.openNodeIn(this._view.selectedNode, "current");
					this.linkplaces.service.removeItem(this._view.selectedNode.itemId);
					break;
				case "placesCmd_open:window":
					PlacesUIUtils.openNodeIn(this._view.selectedNode, "window");
					this.linkplaces.service.removeItem(this._view.selectedNode.itemId);
					break;
				case "placesCmd_open:tab":
					PlacesUIUtils.openNodeIn(this._view.selectedNode, "tab");
					this.linkplaces.service.removeItem(this._view.selectedNode.itemId);
					break;
				default:
					this._doCommand(aCmd);
					break;
			}
		};
		this.treeView.controllers.appendController(this.placesController);
	},

	onUnLoad: function() {
		window.removeEventListener("unload", this, false);
		window.removeEventListener("SidebarFocused", this, false);
		this.clearURLFromStatusBar();
		this.treeView.controllers.removeController(this.placesController);
		//delete this.placesController;
	},

	onSidebarFocused: function () {
		this.treeView.focus();
	},

	// Based on "chrome://browser/content/bookmarks/sidebarUtils.js"
	handleTreeClick: function (aEvent, aGutterSelect) {
		// When right button click
		if (aEvent.button == 2) {
			return;
		}

		var tree = aEvent.target.parentNode;
		var treeBoxObj = tree.treeBoxObject;
		var row = new Object();
		var col = new Object();
		var obj = new Object();
		treeBoxObj.getCellAt(aEvent.clientX, aEvent.clientY, row, col, obj);

		if (row.value == -1 ||  obj.value == "twisty") {
			return;
		}

		// whether mouse in opening item area or not.
		var mouseInGutter = false;
		var cellX = new Object();
		var cellY = new Object();
		var cellW = new Object();
		var cellH = new Object();
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
		var row = new Object();
		var col = new Object();
		var obj = new Object();
		treeBoxObj.getCellAt(aEvent.clientX, aEvent.clientY, row, col, obj);

		if (row.value != -1) {
			var cell = tree.view.nodeForTreeIndex(row.value);
			if (PlacesUtils.nodeIsURI(cell)) {
				window.top.XULBrowserWindow.setOverLink(cell.uri, null);
			}
			else {
				this.clearURLFromStatusBar();
			}
		}
		else {
			this.clearURLFromStatusBar();
		}
	},

	clearURLFromStatusBar: function () {
		window.top.XULBrowserWindow.setOverLink("", null);
	},

	openNodeWithEvent: function (aNode, aEvent) {
		var where = this.whereToOpenLink(aEvent);

		if (this.isBookmarklet(aNode.uri)) {
			PlacesUIUtils.openNodeIn(aNode, "current");
		}
		else {
			PlacesUIUtils.openNodeIn(aNode, where);
		}

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

	isBookmarklet: function (aURI) {
		var reg = new RegExp("^javascript:");
		return reg.test(aURI);
	},

	openSelectionInTabs: function(aController, aEvent) {
		aController.openSelectionInTabs(aEvent);
		if (aController && aController.isCommandEnabled("placesCmd_delete")) {
			aController.doCommand("placesCmd_delete");
		}
	},

};
window.addEventListener("load", LinkplacesPanel, false);

var LinkplacesBrowser = {

	ElmId_contentCtxSavePage: "linkplaces-contentCtx-savePage",
	ElmId_contentCtxSaveLink: "linkplaces-contentCtx-saveLink",

	get service() {
		delete this.service;
		Components.utils.import("resource://linkplaces/linkplaces.js", this);
		return this.service = this.LinkplacesService;
	},

	handleEvent: function (aEvent) {
		switch (aEvent.type) {
			case "load":
				this.onLoad();
				break;
			case "popupshowing":
				this.handleContentCtxPopup();
				break;
			case "unload":
				this.onUnLoad();
				break;
		}
	},

	onLoad: function () {
		window.removeEventListener("load", this, false);
		window.addEventListener("unload", this, false);

		//set Context menu
		this.initContext();
	},

	onUnLoad: function() {
		window.removeEventListener("unload", this, false);

		this.finalizeContext();
	},

	initContext: function () {
		var contentAreaCtx = document.getElementById("contentAreaContextMenu");
		contentAreaCtx.addEventListener("popupshowing", this, false);
	},

	finalizeContext: function () {
		var contentAreaCtx = document.getElementById("contentAreaContextMenu");
		contentAreaCtx.removeEventListener("popupshowing", this, false);
	},

	handleContentCtxPopup: function () {
		gContextMenu.showItem(this.ElmId_contentCtxSavePage,
		                      !(gContextMenu.isContentSelected || gContextMenu.onTextInput || gContextMenu.onLink ||
		                        gContextMenu.onImage || gContextMenu.onVideo || gContextMenu.onAudio));
		gContextMenu.showItem(this.ElmId_contentCtxSaveLink,
		                      gContextMenu.onLink && !gContextMenu.onMailtoLink);
	},

	saveLink: function () {
		this.service.saveItem(gContextMenu.linkURL, gContextMenu.linkText());
	},

	saveThisPage: function () {
		this.saveTab(gBrowser.mCurrentTab);
	},

	saveThisTab: function () {
		this.saveTab(gBrowser.mContextTab);
	},

	saveTab: function (aTab) {
		var browser = aTab.linkedBrowser;
		var uri = browser.currentURI.spec
		var title = browser.contentDocument.title || uri;
		this.service.saveItem(uri, title);
	},

// based on bookmarksButtonObserver class and browserDragAndDrop class
	ButtonOnDrop: function (aEvent) {
		var service = this.service;
		var ip = new InsertionPoint(service.folder,
		                            service.DEFAULT_INDEX,
		                            Components.interfaces.nsITreeView.DROP_ON);
		PlacesControllerDragHelper.onDrop(ip, aEvent.dataTransfer);
	},

	ButtonOnDragOver: function (aEvent) {
		browserDragAndDrop.dragOver(aEvent);
		aEvent.dropEffect = "link";
	},

	ButtonOnDragExit: function (aEvent) {
	}

};
window.addEventListener("load", LinkplacesBrowser, false);

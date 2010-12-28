var LinkplacesBrowserOverlay = {

	ElmId_contentCtxSavePage: "linkplaces-contentCtx-savePage",
	ElmId_contentCtxSaveLink: "linkplaces-contentCtx-saveLink",

	get service() {
		delete this.service;
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

		//Import JS Utils module
		Components.utils.import("resource://linkplaces/linkplaces.js", this);

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
		this.service.saveItem(gContextMenu.linkURL, gContextMenu.linkText(), -1);
	},

	saveThisPage: function () {
		this.saveTab(gBrowser.mCurrentTab);
	},

	saveThisTab: function () {
		this.saveTab(gBrowser.mContextTab);
	},

	saveTab: function (aTab) {
		var URI = aTab.linkedBrowser.currentURI.spec
		var title = aTab.linkedBrowser.contentDocument.title || aTab.getAttribute("label");
		this.service.saveItem(URI, title, -1);
	},

	// based on bookmarksButtonObserver class and browserDragAndDrop class
	ButtonObserver: {

		get service() {
			delete this.service;
			return this.service = LinkplacesBrowserOverlay.service;
		},

		onDrop: function (aEvent) {
			var name = {};
			var uri = browserDragAndDrop.drop(aEvent, name);
			try {
				this.service.saveItem(uri, name.value, -1);
			}
			catch (e) {}
		},

		onDragOver: function (aEvent) {
			browserDragAndDrop.dragOver(aEvent);
			aEvent.dropEffect = "link";
		},

		onDragLeave: function (aEvent) {
		}
	},

};
window.addEventListener("load", LinkplacesBrowserOverlay, false);

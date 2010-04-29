var LinkplacesOverlay = {

	get service() {
		return this.LinkplacesService;
	},

	handleEvent: function (aEvent) {
		switch (aEvent.type) {
			case "load":
				this.onLoad();
				break;
			case "popupshowing":
				this.ctrlContentCtxMenu();
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

		var contentAreaCtx = document.getElementById("contentAreaContextMenu");
		contentAreaCtx.removeEventListener("popupshowing", this, false);

	},

	initContext: function () {
		this.insertAllToTabCtx("linkplaces-tabCtx",
		                       document.getElementById("context_bookmarkAllTabs").nextSibling);

		var contentAreaCtx = document.getElementById("contentAreaContextMenu");
		contentAreaCtx.addEventListener("popupshowing", this, false);
	},

	insertAllToTabCtx: function (aId, aReference) {
		var menuParent = document.getElementById(aId);
		while (menuParent.hasChildNodes()) {
			var node = menuParent.firstChild;
			this.insertToTabCtxBefore(node, aReference);
		}
	},

	insertToTabCtxBefore: function (aElem, aReference) {
		var tabContextMenu = document.getAnonymousElementByAttribute(gBrowser, "anonid", "tabContextMenu") ||
		                     gBrowser.tabContextMenu;
		tabContextMenu.insertBefore(aElem, aReference);
	},

	ctrlContentCtxMenu: function () {
		gContextMenu.showItem("linkplaces-contentCtx-savePage",
		                      !(gContextMenu.isContentSelected || gContextMenu.onTextInput || gContextMenu.onLink ||
		                        gContextMenu.onImage || gContextMenu.onVideo || gContextMenu.onAudio));
		gContextMenu.showItem("linkplaces-contentCtx-saveLink",
		                      gContextMenu.onLink && !gContextMenu.onMailtoLink);
	},

	saveLink: function () {
		urlSecurityCheck(gContextMenu.linkURL, gContextMenu.target.ownerDocument.nodePrincipal);
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
			return LinkplacesOverlay.service;
		},

		_statusText: null,
		get statusText() {
			if (!this._statusText) {
				this._statusText = this.service.strings.get("linkplaces.overlay.drop");
			}
			return this._statusText;
		},

		onDrop: function (aEvent) {
			var [uri, title] = browserDragAndDrop.getDragURLFromDataTransfer(aEvent.dataTransfer);
			try {
				this.service.saveItem(uri, title, -1);
			}
			catch(ex) {}
		},

		onDragOver: function (aEvent) {
			var types = aEvent.dataTransfer.types;
			var typeContain = (types.contains("application/x-moz-file") ||
			                   types.contains("text/x-moz-url") ||
			                   types.contains("text/uri-list") ||
			                   types.contains("text/x-moz-text-internal") ||
			                   types.contains("text/plain"));
			if (typeContain) {
				aEvent.preventDefault();

				var statusTextFld = document.getElementById("statusbar-display");
				statusTextFld.label = this.statusText;
			}

			aEvent.dropEffect = "link";
		},

		onDragLeave: function (aEvent) {
			var statusTextFld = document.getElementById("statusbar-display");
			statusTextFld.label = "";
		}
	},

};
window.addEventListener("load", LinkplacesOverlay, false);

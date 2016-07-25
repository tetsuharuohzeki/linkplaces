/* vim: set filetype=javascript shiftwidth=2 tabstop=2 expandtab: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const EXPORTED_SYMBOLS = ["createWidget", "destroyWidget"];

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;

const BUTTON_ID = "linkplaces-menu-button";
const PANEL_UI_ID = "PanelUI-linkplaces";
const PLACES_VIEW_ID = "panelMenu_linkplacesMenu";

Cu.import("resource:///modules/CustomizableUI.jsm");

function createWidget(service) {
  // If we call this register method with same id multiple times
  // (e.g. load in each browser window), this method fails to register except 1st time.
  // So we need to call this only once.
  const wrapper = CustomizableUI.createWidget({
    id: BUTTON_ID,
    type: "view",
    label: service.stringBundle.GetStringFromName("linkplaces.widget.button.label"),
    viewId: PANEL_UI_ID,
    tooltiptext: service.stringBundle.GetStringFromName("linkplaces.widget.button.tooltip"),
    defaultArea: CustomizableUI.AREA_PANEL,

    onViewShowing(aEvent) {
      let win = aEvent.target.ownerDocument.defaultView;

      let query = service.QUERY_URI;
      let viewId = PLACES_VIEW_ID;
      let rootId = viewId;
      let option = {
        extraClasses: {
          entry: "subviewbutton",
          footer: "panel-subview-footer"
        }
      };

      this._panelMenuView = new win.PlacesPanelMenuView(query, viewId, rootId, option);
    },

    onViewHiding(aEvent) {
      this._panelMenuView.uninit();
      delete this._panelMenuView;
    },
  });
  return wrapper;
}

function destroyWidget(id) {
  CustomizableUI.destroyWidget(id);
}

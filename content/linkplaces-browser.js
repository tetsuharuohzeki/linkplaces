/* vim: set filetype=javascript shiftwidth=2 tabstop=2 expandtab: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/* eslint-env browser */
/* global Components: false */
"use strict";

/*global XPCOMUtils:false*/
Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");
/*global LinkplacesService:false*/
XPCOMUtils.defineLazyModuleGetter(this, "LinkplacesService", //eslint-disable-line no-invalid-this
  "chrome://linkplaces/content/LinkplacesService.js");
{
  const { LinkplacesChrome } = Components.utils.import("chrome://linkplaces/content/LinkplacesChrome.js");

  window.addEventListener("load", function onLoad() {
    window.removeEventListener("load", onLoad, false);

    LinkplacesChrome.create(window, LinkplacesService);
  }, false);
}
// Load immidiately to initialize the UI Widget.
{
  const {createWidget} = Components.utils.import("chrome://linkplaces/content/LinkplacesUIWidget.js", {});
  createWidget();
}

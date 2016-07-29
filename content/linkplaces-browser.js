/* vim: set filetype=javascript shiftwidth=2 tabstop=2 expandtab: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/* eslint-env browser */
/* global Components: false */
"use strict";

{
  const Cu = Components.utils;
  const { require } = Cu.import("resource://gre/modules/commonjs/toolkit/require.js", {});
  const { XPCOMUtils } = Cu.import("resource://gre/modules/XPCOMUtils.jsm");
  const { LinkplacesChrome } = require("chrome://linkplaces/content/LinkplacesChrome.js");
  const { createWidget } = Cu.import("chrome://linkplaces/content/LinkplacesUIWidget.js", {});

  /*global LinkplacesService:false */
  XPCOMUtils.defineLazyModuleGetter(window, "LinkplacesService",
    "chrome://linkplaces/content/LinkplacesService.js");

  window.addEventListener("load", function onLoad() {
    window.removeEventListener("load", onLoad, false);

    LinkplacesChrome.create(window, LinkplacesService);
    createWidget();
  }, false);
}

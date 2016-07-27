/* vim: set filetype=javascript shiftwidth=2 tabstop=2 noexpandtab: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/* eslint-env browser */
"use strict";

{
  const Cu = Components.utils;
  const { LinkplacesService } = Cu.import("chrome://linkplaces/content/LinkplacesService.js", {});
  const { require } = Cu.import("resource://gre/modules/commonjs/toolkit/require.js", {});
  const { LinkplacesChromePlaces } = require("./ui/LinkplacesChromePlaces.js");

  window.addEventListener("load", function onLoad() {
    window.removeEventListener("load", onLoad, false);

    LinkplacesChromePlaces.create(window, LinkplacesService);
  }, false);
}

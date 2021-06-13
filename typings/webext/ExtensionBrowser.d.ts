// https://searchfox.org/mozilla-central/source/dom/webidl/ExtensionBrowser.webidl

import type { ExtensionRuntime } from './ExtensionRuntime';

export interface ExtensionBrowser {
    readonly runtime: ExtensionRuntime;
}

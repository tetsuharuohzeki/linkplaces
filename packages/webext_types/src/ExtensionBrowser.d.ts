// https://searchfox.org/mozilla-central/source/dom/webidl/ExtensionBrowser.webidl

import type { ExtensionRuntime } from './ExtensionRuntime.js';
import type { ExtensionScripting } from './ExtensionScripting.js';

export interface ExtensionBrowser {
    readonly runtime: ExtensionRuntime;
    readonly scripting: ExtensionScripting;
}

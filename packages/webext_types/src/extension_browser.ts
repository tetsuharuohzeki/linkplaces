// https://searchfox.org/mozilla-central/source/dom/webidl/ExtensionBrowser.webidl

import type { ExtensionRuntime } from './extension_runtime.js';
import type { ExtensionScripting } from './extension_scripting.js';

export interface ExtensionBrowser {
    readonly runtime: ExtensionRuntime;
    readonly scripting: ExtensionScripting;
}

export { browser, chrome, type WebExtGlobalNamespace } from './global.js';

export type * from './extension_runtime.js';
export type {
    ExtensionScripting,
    InjectionResult,
    ContentScriptFilter,
    InjectionTarget,
    RegisteredContentScript,
} from './extension_scripting.js';

export type * from './bookmarks.js';
export type * from './context_menus.js';
export type * from './extension_port.js';
export type * from './sidebar_action.js';
export type * from './tabs.js';
export type * from './windows.js';

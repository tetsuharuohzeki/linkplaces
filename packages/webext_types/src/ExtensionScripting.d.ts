// https://searchfox.org/mozilla-central/source/dom/webidl/ExtensionScripting.webidl

import type { RunAt } from './extensionTypes.js';
import type { TabId } from './tabs.js';

interface ExecuteScriptArgsBase {
    injectImmediately?: boolean;
    target: InjectionTarget;
}

interface ExecuteScriptFileArgs extends ExecuteScriptArgsBase {
    files: Array<string>;
}

interface ExecuteScriptFunctionArgs<TFunc extends Function> extends ExecuteScriptArgsBase {
    func: TFunc;
    args: Parameters<TFunc>;
}

interface InsertCSSArgsBase {
    origin?: 'USER' | 'AUTHOR';
    target: InjectionTarget;
}

interface InsertCSSTextArgs extends InsertCSSArgsBase {
    css: string;
}

interface InsertCSSFilesArgs extends InsertCSSArgsBase {
    files: Array<string>;
}

// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/scripting
export interface ExtensionScripting {
    /**
     *  https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/scripting/executeScript
     */
    executeScript(details: ExecuteScriptFileArgs | ExecuteScriptFunctionArgs): Promise<ReadonlyArray<InjectionResult>>;

    /**
     *  https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/scripting/insertCSS
     */
    insertCSS(details: InsertCSSTextArgs | InsertCSSFilesArgs): Promise<void>;

    /**
     *  https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/scripting/removeCSS
     */
    removeCSS(details: InsertCSSTextArgs | InsertCSSFilesArgs): Promise<void>;

    /**
     *  https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/scripting/registerContentScripts
     */
    registerContentScripts(script: Array<RegisteredContentScript>): Promise<ReadonlyArray<RegisteredContentScript>>;

    /**
     *  https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/scripting/getRegisteredContentScripts
     */
    getRegisteredContentScripts(filter?: ContentScriptFilter): Promise<ReadonlyArray<ContentScriptFilter>>;

    /**
     * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/scripting/unregisterContentScripts
     */
    unregisterContentScripts(script: ContentScriptFilter): Promise<void>;

    /**
     *  https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/scripting/updateContentScripts
     */
    updateContentScripts(script: Array<RegisteredContentScript>): Promise<ReadonlyArray<RegisteredContentScript>>;
}

export interface InjectionResult<TResult = unknown> {
    frameId: number;
    result?: TResult;
    error?: {
        message: string;
    };
}

export type ScriptId = string;

/**
 *  @see    https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/scripting/RegisteredContentScript
 */
export interface ContentScriptFilter {
    ids: Array<ScriptId>;
}

type FrameId = number;

/**
 *  @see    https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/scripting/InjectionTarget
 */
export interface InjectionTarget {
    allFrames?: boolean;
    frameIds?: Array<FrameId>;
    tabId?: TabId;
}

type RegisteredContentScriptId = string;

/**
 *  @see    https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/scripting/RegisteredContentScript
 */
export interface RegisteredContentScript {
    allFrames?: boolean;
    css?: Array<string>;
    excludeMatches?: Array<string>;
    id: RegisteredContentScriptId;
    js?: Array<string>;
    matches?: Array<string>;
    persistAcrossSessions?: boolean;
    runAt?: RunAt;
}

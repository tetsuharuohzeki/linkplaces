// https://searchfox.org/mozilla-central/source/dom/webidl/ExtensionRuntime.webidl
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime

import type { ExtensionEventManager } from './ExtensionEventManager.js';
import type { ExtensionPort } from './ExtensionPort.js';

// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/connect
interface ConnectionInfo {
    name?: string;
    includeTlsChannelIdOptional?: boolean;
}

interface SendMessageOption {
    includeTlsChannelIdOptional?: boolean;
}

interface GetBrowserInfoResult {
    name: string;
    vendor: string;
    version: string;
    buildID: string;
}

type PlatformOs = 'mac' | 'win' | 'android' | 'cros' | 'linux' | 'openbsd';
type PlatformArch = 'arm' | 'x86-32' | 'x86-64';

interface PlatformInfo {
    os: PlatformOs;
    arch: PlatformArch;
}

// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/MessageSender
export interface ExtensionMessageSender {
    // tab?
    readonly frameId?: number;
    readonly id?: string;
    readonly url?: string;
    readonly tlsChannelId?: string;
}

/**
 *  https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/OnInstalledReason
 */
export type OnInstalledReason = 'install' | 'update' | 'browser_update' | 'shared_module_update';

interface OnInstalledArgsBase {
    reason: OnInstalledReason;
    temporary: boolean;
}

interface OnUpdateInstalledArgs extends OnInstalledArgsBase {
    reason: 'update';
    previousVersion: string;
}

interface OnSharedModuleUpdateInstalledArgs extends OnInstalledArgsBase {
    reason: 'shared_module_update';
    id: string;
}

/**
 *  https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onInstalled
 */
export type OnInstalledArgs = OnInstalledArgsBase | OnUpdateInstalledArgs | OnSharedModuleUpdateInstalledArgs;

export interface ExtensionRuntime {
    openOptionsPage(): Promise<void>;
    getManifest(): object;
    getURL(path: string): string;
    setUninstallURL(url: string): Promise<void>;
    reload(): void;

    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/connect
    connect();
    connect(connectInfo: ConnectionInfo): ExtensionPort;
    connect(extensionId: string, connectInfo: ConnectionInfo): ExtensionPort;

    connectNative(application: string): ExtensionPort;
    sendMessage<TResponse = void>(message: object, oprion?: SendMessageOption): Promise<TResponse>;
    sendMessage<TResponse = void>(extensionId: string, message: object, oprion?: SendMessageOption): Promise<TResponse>;
    sendNativeMessage<TResponse = void>(application: string, message?: object): Promise<TResponse>;
    getBrowserInfo(): Promise<GetBrowserInfoResult>;
    getPlatformInfo(): Promise<PlatformInfo>;

    readonly onStartup: ExtensionEventManager;
    readonly onInstalled: ExtensionEventManager<(detail: OnInstalledArgs) => void | Promise<void>>;
    readonly onSuspend: ExtensionEventManager;
    readonly onUpdateAvailable: ExtensionEventManager;
    readonly onConnect: ExtensionEventManager<(port: ExtensionPort) => void>;
    readonly onConnectExternal: ExtensionEventManager<(port: ExtensionPort) => void>;
    readonly onMessage: ExtensionEventManager<(message: object, sender: ExtensionMessageSender) => Promise<unknown>>;
    readonly onMessageExternal: ExtensionEventManager;

    readonly lastError: unknown;
    readonly id: string;
}

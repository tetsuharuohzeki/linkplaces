// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime

import type { ExtensionEventManager } from './ExtensionEventManager';
import type { ExtensionPort } from './ExtensionPort';

// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/MessageSender
export interface PortHasSender extends ExtensionPort {
    readonly sender: MessageSender;
}

// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/MessageSender
export interface MessageSender {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly tab?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly frameId?: any;
    readonly id?: string;
    readonly url?: string;
    readonly tlsChannelId?: string;
}

// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/PlatformOs
export type PlatformOs =
    | 'mac'
    | 'win'
    | 'android'
    | 'cros'
    | 'linux'
    | 'openbsd';

// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/PlatformArch
export type PlatformArch = 'arm' | 'x86-32' | 'x86-64';

// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/PlatformInfo
export interface PlatformInfo {
    readonly os: PlatformOs;
    readonly arch: PlatformArch;
    // nacl_arch;
}

// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/RequestUpdateCheckStatus
// export type RequestUpdateCheckStatus = 'throttled' | 'no_update' | 'update_available';

// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/OnInstalledReason
export type OnInstalledReason =
    | 'install'
    | 'update'
    | 'chrome_update'
    | 'shared_module_update';

// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/OnRestartRequiredReason
export type OnRestartRequiredReason = 'app_update' | 'os_update' | 'periodic';

// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime
export interface WebExtRuntimeService {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly lastError: any;
    readonly id: string;

    // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/connect
    connect(): Promise<ExtensionPort>;
    connect(connectInfo: {
        name?: string;
        includeTlsChannelId?: boolean;
    }): Promise<ExtensionPort>;
    connect(
        extensionId: string,
        connectInfo?: { name?: string; includeTlsChannelId?: boolean; }
    ): Promise<ExtensionPort>;

    // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/getBackgroundPage
    getBackgroundPage(): Promise<Window>;
    // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/openOptionsPage
    openOptionsPage(): Promise<void>;

    // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/sendMessage
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sendMessage<TResult>(message: any): Promise<TResult>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sendMessage<TResult>(extensionId: string, message: any): Promise<TResult>;
    sendMessage<TResult>(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        message: any,
        options: {
            includeTlsChannelId?: boolean;
            toProxyScript: boolean;
        }
    ): Promise<TResult>;
    sendMessage<TResult>(
        extensionId: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        message: any,
        options: {
            includeTlsChannelId?: boolean;
            toProxyScript: boolean;
        }
    ): Promise<TResult>;

    // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/onConnect
    readonly onConnect: ExtensionEventManager<(port: PortHasSender) => void>;
}

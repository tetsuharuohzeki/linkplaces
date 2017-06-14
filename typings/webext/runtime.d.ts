// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime

import { Listener, FullListener } from './event';

// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/Port
export interface Port<T> {
    readonly name: string;
    disconnect(): void;
    readonly error: Error;

    readonly onDisconnect: Listener<this>;
    readonly onMessage: Listener<T>;
    postMessage(value: T): void;
}

// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/MessageSender
export interface PortHasSender<T> extends Port<T> {
    readonly sender: MessageSender;
}

// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/MessageSender
export interface MessageSender {
    readonly tab?: any;
    readonly frameId?: any;
    readonly id?: string;
    readonly url?: string;
    readonly tlsChannelId?: string;
}

// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/PlatformOs
export type PlatformOs = 'mac' | 'win' | 'android' | 'cros' | 'linux' | 'openbsd';

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
export type OnInstalledReason = 'install' | 'update' | 'chrome_update' | 'shared_module_update';

// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/OnRestartRequiredReason
export type OnRestartRequiredReason = 'app_update' | 'os_update' | 'periodic';

// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime
export interface Runtime {
    readonly lastError: any;
    readonly id: string;

    // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/getBackgroundPage
    getBackgroundPage(): Promise<Window>;
    // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/openOptionsPage
    openOptionsPage(): Promise<void>;

    // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/sendMessage
    sendMessage<R>(message: any): Promise<R>;
    sendMessage<R>(extensionId: string, message: any): Promise<R>;
    sendMessage<R>(message: any, options: {
        includeTlsChannelId?: boolean;
        toProxyScript: boolean;
    }): Promise<R>;
    sendMessage<R>(extensionId: string, message: any, options: {
        includeTlsChannelId?: boolean;
        toProxyScript: boolean;
    }): Promise<R>;

    // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/onConnect
    readonly onConnect: FullListener<(port: PortHasSender<any>) => void>;
}

// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime

import { Listener, FullListener } from './event';

// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/Port
export interface Port {
    readonly name: string;
    disconnect(): void;
    readonly error: Error;

    readonly onDisconnect: Listener<(port: this) => void>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly onMessage: Listener<(object: any) => void>;
    postMessage<T>(value: T): void;
}

// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/MessageSender
export interface PortHasSender extends Port {
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
export interface WebExtRuntimeService {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly lastError: any;
    readonly id: string;

    // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/connect
    connect<T>(): Promise<Port>;
    connect<T>(connectInfo: { name?: string; includeTlsChannelId?: boolean; }): Promise<Port>;
    connect<T>(extensionId: string, connectInfo?: { name?: string; includeTlsChannelId?: boolean; }): Promise<Port>;

    // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/getBackgroundPage
    getBackgroundPage(): Promise<Window>;
    // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/openOptionsPage
    openOptionsPage(): Promise<void>;

    // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/sendMessage
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sendMessage<R>(message: any): Promise<R>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sendMessage<R>(extensionId: string, message: any): Promise<R>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sendMessage<R>(message: any, options: {
        includeTlsChannelId?: boolean;
        toProxyScript: boolean;
    }): Promise<R>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sendMessage<R>(extensionId: string, message: any, options: {
        includeTlsChannelId?: boolean;
        toProxyScript: boolean;
    }): Promise<R>;

    // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/onConnect
    readonly onConnect: FullListener<(port: PortHasSender) => void>;
}

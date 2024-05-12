import type { BookmarkId } from '@linkplaces/webext_types';
import { isNull } from 'option-t/Nullable';

export const CONNECTION_PING_FROM_POPUP = 'CONNECTION_PING_FROM_POPUP';
export const CONNECTION_PING_FROM_SIDEBAR = 'CONNECTION_PING_FROM_SIDEBAR';

export const MSG_TYPE_OPEN_URL = 'linkplaces-open-url';
export const MSG_TYPE_REGISTER_URL = 'linkplaces-register-url';

export enum WhereToOpenItem {
    Current = 'current',
    Window = 'window',
    Tab = 'tab',
    BackgroundTab = 'background_tab',
}

export interface RemoteActionBase {
    type: string;
    value?: unknown;
}

export interface OpenUrlAction extends RemoteActionBase {
    type: typeof MSG_TYPE_OPEN_URL;
    value: {
        id: BookmarkId;
        url: string;
        where: WhereToOpenItem;
    };
}
export function isOpenUrlAction(v: RemoteActionBase): v is OpenUrlAction {
    return v.type === MSG_TYPE_OPEN_URL;
}
export function createOpenUrlAction(bookmarkId: BookmarkId, url: string, where: WhereToOpenItem): OpenUrlAction {
    return {
        type: MSG_TYPE_OPEN_URL,
        value: {
            id: bookmarkId,
            url,
            where,
        },
    };
}

export interface RegisterUrlAction extends RemoteActionBase {
    type: typeof MSG_TYPE_REGISTER_URL;
    value: {
        url: string;
        title: string;
    };
}
export function isRegisterUrlAction(v: RemoteActionBase): v is RegisterUrlAction {
    return v.type === MSG_TYPE_REGISTER_URL;
}
export function createRegisterUrlAction(url: string, title: string): RegisterUrlAction {
    return {
        type: MSG_TYPE_REGISTER_URL,
        value: {
            url,
            title,
        },
    };
}

export type RemoteAction = OpenUrlAction | RegisterUrlAction;

export function assertIsRemoteAction(value: unknown): asserts value is RemoteAction {
    if (isRemoteAction(value)) {
        return;
    }

    throw new TypeError(`${JSON.stringify(value)} is not RemoteAction`);
}

function isRemoteAction(value: unknown): value is RemoteAction {
    if (typeof value !== 'object') {
        return false;
    }

    if (isNull(value)) {
        return false;
    }

    if (!Object.hasOwn(value, 'type')) {
        return false;
    }

    if (!Object.hasOwn(value, 'value')) {
        return false;
    }

    return true;
}

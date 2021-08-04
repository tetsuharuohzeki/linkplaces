import { isNull } from 'option-t/esm/Nullable/Nullable';

export const CONNECTION_PING_FROM_POPUP = 'CONNECTION_PING_FROM_POPUP';
export const CONNECTION_PING_FROM_SIDEBAR = 'CONNECTION_PING_FROM_SIDEBAR';

export const MSG_TYPE_OPEN_URL = 'linkplaces-open-url';
export const MSG_TYPE_REGISTER_URL = 'linkplaces-register-url';

export const WHERE_TO_OPEN_ITEM_TO_CURRENT = 'current';
export const WHERE_TO_OPEN_ITEM_TO_WINDOW = 'window';
export const WHERE_TO_OPEN_ITEM_TO_TAB = 'tab';
export const WHERE_TO_OPEN_ITEM_TO_BACKGROUND_TAB = 'background_tab';

export type WhereToOpenItem =
    typeof WHERE_TO_OPEN_ITEM_TO_CURRENT |
    typeof WHERE_TO_OPEN_ITEM_TO_WINDOW |
    typeof WHERE_TO_OPEN_ITEM_TO_TAB |
    typeof WHERE_TO_OPEN_ITEM_TO_BACKGROUND_TAB;

export interface RemoteActionBase {
    type: string;
    value?: unknown;
}

export interface OpenUrlAction extends RemoteActionBase {
    type: typeof MSG_TYPE_OPEN_URL;
    value: {
        id: string;
        url: string;
        where: WhereToOpenItem;
    };
}
export function isOpenUrlAction(v: RemoteActionBase): v is OpenUrlAction {
    return v.type === MSG_TYPE_OPEN_URL;
}
export function createOpenUrlAction(bookmarkId: string, url: string, where: WhereToOpenItem): OpenUrlAction {
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

export type RemoteAction =
    OpenUrlAction | RegisterUrlAction;

const hasOwnProperty = Object.prototype.hasOwnProperty;

export function isRemoteAction(value: unknown): value is RemoteAction {
    if (typeof value !== 'object') {
        return false;
    }

    if (isNull(value)) {
        return false;
    }

    if (!hasOwnProperty.call(value, 'type')) {
        return false;
    }

    if (!hasOwnProperty.call(value, 'value')) {
        return false;
    }

    return true;
}

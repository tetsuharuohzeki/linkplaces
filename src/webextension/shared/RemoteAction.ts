export const CONNECTION_PING_FROM_POPUP = 'CONNECTION_PING_FROM_POPUP';
export const CONNECTION_PING_FROM_SIDEBAR = 'CONNECTION_PING_FROM_SIDEBAR';

export const MSG_TYPE_OPEN_URL = 'linkplaces-open-url';
export const MSG_TYPE_OPEN_ORGANIZE_WINDOW = 'linkplaces-open-classic-organize-window';

export interface RemoteActionBase {
    type: string;
    value?: any;
}

export interface OpenUrlAction extends RemoteActionBase {
    type: typeof MSG_TYPE_OPEN_URL;
    value: {
        id: string;
        url: string;
    };
}
export function isOpenUrlAction(v: RemoteActionBase): v is OpenUrlAction {
    return v.type === MSG_TYPE_OPEN_URL;
}
export function createOpenUrlAction(bookmarkId: string, url: string): OpenUrlAction {
    return {
        type: MSG_TYPE_OPEN_URL,
        value: {
            id: bookmarkId,
            url,
        },
    };
}

interface OpenClassicPlacesOrganizerAction extends RemoteActionBase {
    type: typeof MSG_TYPE_OPEN_ORGANIZE_WINDOW;
    value: {
        bookmarkId: string;
    };
}
export function isOpenClassicPlacesOrganizerAction(v: RemoteActionBase): v is OpenClassicPlacesOrganizerAction {
    return v.type === MSG_TYPE_OPEN_ORGANIZE_WINDOW;
}
export function createOpenClassicPlacesOrganizerAction(bookmarkId: string): OpenClassicPlacesOrganizerAction {
    return {
        type: MSG_TYPE_OPEN_ORGANIZE_WINDOW,
        value: {
            bookmarkId,
        },
    };
}

export type RemoteAction =
    OpenUrlAction |
    OpenClassicPlacesOrganizerAction;

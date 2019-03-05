export const CONNECTION_PING_FROM_POPUP = 'CONNECTION_PING_FROM_POPUP';
export const CONNECTION_PING_FROM_SIDEBAR = 'CONNECTION_PING_FROM_SIDEBAR';

export const MSG_TYPE_OPEN_URL = 'linkplaces-open-url';

export const WHERE_TO_OPEN_ITEM_TO_CURRENT = 'current';
export const WHERE_TO_OPEN_ITEM_TO_WINDOW = 'window';
export const WHERE_TO_OPEN_ITEM_TO_SAVE = 'save';
export const WHERE_TO_OPEN_ITEM_TO_TAB = 'tab';
export const WHERE_TO_OPEN_ITEM_TO_TABSHIFTED = 'tabshifted';

export type WhereToOpenItem =
    typeof WHERE_TO_OPEN_ITEM_TO_CURRENT |
    typeof WHERE_TO_OPEN_ITEM_TO_WINDOW |
    typeof WHERE_TO_OPEN_ITEM_TO_SAVE |
    typeof WHERE_TO_OPEN_ITEM_TO_TAB |
    typeof WHERE_TO_OPEN_ITEM_TO_TABSHIFTED;

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

export type RemoteAction =
    OpenUrlAction;

export const MSG_TYPE_OPEN_URL = 'linkplaces-open-tab';
export const MSG_TYPE_OPEN_URL_RESULT = 'linkplaces-open-tab-result';
export const MSG_TYPE_OPEN_URL_FROM_POPUP = 'linkplaces-open-url';
export const MSG_TYPE_OPEN_SIDEBAR_FROM_POPUP = 'linkplaces-open-classic-sidebar';
export const MSG_TYPE_OPEN_ORGANIZE_WINDOW_FROM_POPUP = 'linkplaces-open-classic-organize-window';

interface RemoteActionBase {
    type: string;
}

interface OpenUrlAction extends RemoteActionBase {
    type: typeof MSG_TYPE_OPEN_URL_FROM_POPUP;
    value: {
        id: string;
        url: string;
    };
}

interface OpenClassocSidebarAction extends RemoteActionBase {
    type: typeof MSG_TYPE_OPEN_SIDEBAR_FROM_POPUP;
    value: null;
}

interface OpenClassicPlacesOrganizer extends RemoteActionBase {
    type: typeof MSG_TYPE_OPEN_ORGANIZE_WINDOW_FROM_POPUP;
    value: {
        bookmarkId: string;
    };
}

export type RemoteActionMsg =
    OpenUrlAction |
    OpenClassocSidebarAction |
    OpenClassicPlacesOrganizer;

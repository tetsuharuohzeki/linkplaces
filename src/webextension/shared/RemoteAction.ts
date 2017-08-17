export const CONNECTION_PING_FROM_POPUP = 'CONNECTION_PING_FROM_POPUP';
export const CONNECTION_PING_FROM_SIDEBAR = 'CONNECTION_PING_FROM_SIDEBAR';

export const MSG_TYPE_OPEN_URL = 'linkplaces-open-url';
export const MSG_TYPE_OPEN_SIDEBAR = 'linkplaces-open-classic-sidebar';
export const MSG_TYPE_OPEN_ORGANIZE_WINDOW = 'linkplaces-open-classic-organize-window';

interface RemoteActionBase {
    type: string;
}

interface OpenUrlAction extends RemoteActionBase {
    type: typeof MSG_TYPE_OPEN_URL;
    value: {
        id: string;
        url: string;
    };
}

interface OpenClassicSidebarAction extends RemoteActionBase {
    type: typeof MSG_TYPE_OPEN_SIDEBAR;
    value: null;
}

interface OpenClassicPlacesOrganizer extends RemoteActionBase {
    type: typeof MSG_TYPE_OPEN_ORGANIZE_WINDOW;
    value: {
        bookmarkId: string;
    };
}

export type RemoteAction =
    OpenUrlAction |
    OpenClassicSidebarAction |
    OpenClassicPlacesOrganizer;

import type { ExtensionEventManager } from './ExtensionEventManager.js';
import type { Tab } from './tabs.js';

// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/contextMenus/ContextType
export type ContextType =
    'all' | 'audio' | 'browser_action' | 'editable' | 'frame' | 'image' | 'link' |
    'page' | 'page_action' | 'password' | 'selection' | 'tab' | 'video';

// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/contextMenus/ItemType
export type ItemType = 'normal' | 'checkbox' | 'radio';

export type MenuItemId = string | number; // string or integer.

export type ModifierKeyValue = 'Command' | 'Ctrl' | 'MacCtrl' | 'Shift';

// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/contextMenus/OnClickData
export type OnClickData = {
    checked?: boolean;
    editable: boolean;
    frameUrl?: string;
    linkText?: string;
    linkUrl?: string;
    mediaType?: 'image' | 'vide' | 'audio';
    menuItemId: MenuItemId;
    modifiers: Array<ModifierKeyValue>;
    pageUrl?: string;
    parentMenuItemId?: MenuItemId;
    selectionText?: string;
    srcUrl?: string;
    wasChecked?: boolean;
};

export type CreateArgument = {
    checked?: boolean;
    command?: '_execute_browser_action' | '_execute_page_action' | '_execute_sidebar_action';
    contexts?: Array<ContextType>;
    documentUrlPatterns?: Array<string>;
    enabled?: boolean;
    id?: string;
    onclick?: (this: void) => void;
    parentId?: MenuItemId;
    targetUrlPatterns?: Array<string>;
    title?: string;
    type?: ItemType;
};

// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/contextMenus
export interface WebExtContextMenuService {
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/contextMenus/create
    create(createProperties: CreateArgument, callback: (this: void) => void): MenuItemId;

    // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/contextMenus/update
    update(id: MenuItemId, updateProperties: CreateArgument): Promise<void>;

    // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/contextMenus/remove
    remove(menuItemId: MenuItemId): Promise<void>;

    // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/contextMenus/removeAll
    removeAll(): Promise<void>;

    // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/contextMenus/onClicked
    onClicked: ExtensionEventManager<(this: void, info: OnClickData, tab: Tab | null | undefined) => void>;

    // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/contextMenus/ACTION_MENU_TOP_LEVEL_LIMIT
    readonly ACTION_MENU_TOP_LEVEL_LIMIT: number;
}

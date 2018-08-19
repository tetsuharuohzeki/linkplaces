import {
    PopupItemIconElement,
    LOCAL_NAME_POPUP_ITEM_ICON,

    PopupFolderIconElement,
    LOCAL_NAME_POPUP_FOLDER_ICON,
} from './PopupIconElement';

export function registerComponents(): void {
    window.customElements.define(LOCAL_NAME_POPUP_ITEM_ICON, PopupItemIconElement);
    window.customElements.define(LOCAL_NAME_POPUP_FOLDER_ICON, PopupFolderIconElement);
}

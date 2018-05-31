import React from 'react';

import {
    PopupItemIconElement,
    LOCAL_NAME_POPUP_ITEM_ICON,

    PopupFolderIconElement,
    LOCAL_NAME_POPUP_FOLDER_ICON,

    PopupItemIconElementAttr,
    PopupFolderIconElementAttr,
} from './PopupIconElement';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            [LOCAL_NAME_POPUP_ITEM_ICON]: React.DetailedHTMLProps<React.HTMLAttributes<PopupItemIconElement> & PopupFolderIconElementAttr, PopupItemIconElement>;
            [LOCAL_NAME_POPUP_FOLDER_ICON]: React.DetailedHTMLProps<React.AreaHTMLAttributes<PopupFolderIconElement> & PopupItemIconElementAttr, PopupFolderIconElement>;
        }
    }
}

export function registerComponents(): void {
    window.customElements.define(LOCAL_NAME_POPUP_ITEM_ICON, PopupItemIconElement);
    window.customElements.define(LOCAL_NAME_POPUP_FOLDER_ICON, PopupFolderIconElement);
}

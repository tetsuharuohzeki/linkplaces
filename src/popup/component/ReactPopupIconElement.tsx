import React from 'react';

import {
    ATTR_NAME_SRC,
    PopupItemIconElement,
    LOCAL_NAME_POPUP_ITEM_ICON,

    PopupFolderIconElement,
    LOCAL_NAME_POPUP_FOLDER_ICON,

    PopupItemIconElementAttr,
    PopupFolderIconElementAttr,
} from './PopupIconElement';

interface ReactPopupFolderIconElementArgs extends React.AreaHTMLAttributes<PopupFolderIconElement> {
    [ATTR_NAME_SRC]: string;
}
export function ReactPopupFolderIconElement(props: ReactPopupFolderIconElementArgs): JSX.Element {
    const src = props[ATTR_NAME_SRC];
    return (
        <popup-folder-icon data-src={src}/>
    );
}

interface ReactPopupItemIconElementElementArgs extends React.HTMLAttributes<PopupItemIconElement> {
    [ATTR_NAME_SRC]: string;
}
export function ReactPopupItemIconElement(props: ReactPopupItemIconElementElementArgs): JSX.Element {
    const src = props[ATTR_NAME_SRC];

    return (
        <popup-item-icon data-src={src}/>
    );
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            [LOCAL_NAME_POPUP_ITEM_ICON]: React.DetailedHTMLProps<React.HTMLAttributes<PopupItemIconElement> & PopupFolderIconElementAttr, PopupItemIconElement>;
            [LOCAL_NAME_POPUP_FOLDER_ICON]: React.DetailedHTMLProps<React.AreaHTMLAttributes<PopupFolderIconElement> & PopupItemIconElementAttr, PopupFolderIconElement>;
        }
    }
}

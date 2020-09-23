import { Nullable } from 'option-t/esm/Nullable/Nullable';
import { StrictMode, MouseEvent, MouseEventHandler, useState } from 'react';

import { BookmarkTreeNode, BookmarkTreeNodeItem, BookmarkTreeNodeFolder } from '../../typings/webext/bookmarks';

import { isBookmarkTreeNodeSeparator, isBookmarkTreeNodeItem } from '../shared/Bookmark';
import {
    PanelListItem,
    PanelListItemIcon,
    PanelListItemText,
} from '../shared/component/PanelListItem';
import { PanelSectionList, PanelSectionListSeparator } from '../shared/component/PanelSectionList';

import { PopupMainState } from './PopupMainState';
import { PopupMainStore } from './PopupMainStore';
import { openItem, openLibraryWindow, openWebExtSidebar } from './PopupMainThunk';

const ICON_DIR = '../resources/icon/';

export interface PopupMainViewProps {
    state: PopupMainState;
    store: PopupMainStore;
}

export function PopupMainView(props: Readonly<PopupMainViewProps>): JSX.Element {
    const { state, store, } = props;

    const onClickOpenWebExtSidebar = (_event: MouseEvent<HTMLDivElement>) => {
        const a = openWebExtSidebar();
        store.dispatch(a).catch(console.error);
    };

    const items = state.list.map((item, i) => {
        const v = <ListItem key={i} item={item} store={store} />;
        return v;
    });

    return (
        <StrictMode>
            <div>
                <PanelSectionList>
                    <PanelListItem onClick={onClickOpenWebExtSidebar}>
                        <PanelListItemIcon>
                            <popup-item-icon icondir={ICON_DIR} iconfile={'sidebar-left-16.svg'} />
                        </PanelListItemIcon>
                        <PanelListItemText>
                            <span className={'popup__listitem_text_inner'}>
                                {'View LinkPlaces Sidebar'}
                            </span>
                        </PanelListItemText>
                    </PanelListItem>
                </PanelSectionList>
                <PanelSectionListSeparator />
                <PanelSectionList>
                    {items}
                </PanelSectionList>
            </div>
        </StrictMode>
    );
}

interface ListItemProps {
    item: BookmarkTreeNode;
    store: PopupMainStore;
}
function ListItem(props: ListItemProps): JSX.Element {
    const { item, store, } = props;

    let node: JSX.Element;
    if (isBookmarkTreeNodeSeparator(item)) {
        node = <hr />;
    }
    else if (isBookmarkTreeNodeItem(item)) {
        node = <ItemListItem item={item} store={store} />;
    }
    else {
        node = <FolderListItem item={item} store={store} />;
    }

    return node;
}

interface FolderListItemProps {
    item: BookmarkTreeNodeFolder;
    store: PopupMainStore;
}
function FolderListItem(props: FolderListItemProps): JSX.Element {
    const { item, store } = props;

    const id = item.id;

    const onClick: MouseEventHandler<HTMLDivElement> = (event: MouseEvent<HTMLDivElement>) => {
        event.preventDefault();

        const a = openLibraryWindow(id);
        store.dispatch(a).catch(console.error);
    };

    // http://design.firefox.com/StyleGuide/#/navigation
    return (
        <StrictMode>
            <span
                className={'popup-c-PopupMainView-ItemListItem__container'}
            >
                <PanelListItem onClick={onClick}>
                    <PanelListItemIcon>
                        <popup-item-icon icondir={ICON_DIR} iconfile={'folder-16.svg'} />
                    </PanelListItemIcon>
                    <PanelListItemText>
                        {item.title}
                    </PanelListItemText>
                </PanelListItem>
            </span>
        </StrictMode>
    );
}

interface ItemListItemProps {
    item: BookmarkTreeNodeItem;
    store: PopupMainStore;
}
function ItemListItem(props: ItemListItemProps): Nullable<JSX.Element> {
    const { item, store } = props;
    const url = item.url;
    const id = item.id;

    const [isOpening, setIsOpening] = useState<boolean>(false);
    if (isOpening) {
        return null;
    }

    const onClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
        event.preventDefault();

        const a = openItem(id, url);
        store.dispatch(a).catch(console.error);

        setIsOpening(true);
    };

    const title = item.title;
    const tooltiptext = `"${title}"\n${url}`;
    const label = (title === '') ?
        url :
        title;

    // http://design.firefox.com/StyleGuide/#/navigation
    return (
        <StrictMode>
            <a
                className={'popup-c-PopupMainView-ItemListItem__container'}
                href={url}
                title={tooltiptext}
                onClick={onClick}
            >
                <PanelListItem>
                    <PanelListItemIcon>
                        <popup-item-icon icondir={ICON_DIR} iconfile={'globe-16.svg'} />
                    </PanelListItemIcon>
                    <PanelListItemText>
                        {label}
                    </PanelListItemText>
                </PanelListItem>
            </a>
        </StrictMode>
    );
}

export type A = 2;

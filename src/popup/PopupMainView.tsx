import React from 'react';
//import * as PropTypes from 'prop-types';

import { BookmarkTreeNode, BookmarkTreeNodeItem, BookmarkTreeNodeFolder } from '../../typings/webext/bookmarks';

import { isBookmarkTreeNodeSeparator, isBookmarkTreeNodeItem } from '../shared/Bookmark';
import { Panel } from '../shared/component/Panel';
import { PanelSectionList } from '../shared/component/PanelSectionList';
import { PanelListItem } from '../shared/component/PanelListItem';
import { PanelListItemText } from '../shared/component/PanelListItemText';

import {
    ReactPopupFolderIconElement,
    ReactPopupItemIconElement,
} from './component/PopupIconElement';

import { PopupMainState } from './PopupMainState';
import { openItem, openLibraryWindow, openWebExtSidebar } from './PopupMainThunk';
import { PopupMainStore } from './PopupMainStore';

export interface PopupMainViewProps {
    state: PopupMainState;
    store: PopupMainStore;
}

export function PopupMainView(props: Readonly<PopupMainViewProps>): JSX.Element {
    const { state, store, } = props;

    const onClickOpenWebExtSidebar = (_event: React.MouseEvent<HTMLDivElement>) => {
        const a = openWebExtSidebar();
        store.dispatch(a);
    };

    const items = state.list.map((item, i) => {
        const v = <ListItem key={i} item={item} store={store} />;
        return v;
    });

    return (
        <Panel>
            <PanelSectionList>
                <PanelListItem onClick={onClickOpenWebExtSidebar}>
                    <ReactPopupItemIconElement data-src={'../shared/image/icon/sidebar-16.svg'} />
                    <PanelListItemText>
                        <span className={'popup__listitem_text_inner'}>
                            {'View LinkPlaces Sidebar'}
                        </span>
                    </PanelListItemText>
                </PanelListItem>
            </PanelSectionList>

            <PanelSectionList>
                {items}
            </PanelSectionList>
        </Panel>
    );
}
(PopupMainView as React.StatelessComponent<PopupMainViewProps>).propTypes = {
};

interface ListItemProps {
    item: BookmarkTreeNode;
    store: PopupMainStore;
}
function ListItem(props: ListItemProps): JSX.Element {
    const { item, store, } = props;

    let node: JSX.Element;
    if (isBookmarkTreeNodeSeparator(item)) {
        node = <hr/>;
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

    const onClick: React.MouseEventHandler<HTMLDivElement> = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();

        const a = openLibraryWindow(id);
        store.dispatch(a);
    };

    // http://design.firefox.com/StyleGuide/#/navigation
    return (
        <PanelListItem onClick={onClick}>
            <ReactPopupFolderIconElement data-src={'../shared/image/icon/folder-16.svg'} />
            <PanelListItemText>
                <span className={'popup__listitem_text_inner'}>
                    {item.title}
                </span>
            </PanelListItemText>
        </PanelListItem>
    );
}

interface ItemListItemProps {
    item: BookmarkTreeNodeItem;
    store: PopupMainStore;
}
function ItemListItem(props: ItemListItemProps): JSX.Element {
    const { item, store } = props;
    const url = item.url;
    const id = item.id;

    const onClick: React.MouseEventHandler<HTMLAnchorElement> = (event) => {
        event.preventDefault();

        const a = openItem(id, url);
        store.dispatch(a);
    };

    const title = item.title;
    const tooltiptext = `"${title}"\n${url}`;

    // http://design.firefox.com/StyleGuide/#/navigation
    return (
        <PanelListItem>
            <ReactPopupItemIconElement data-src={'../shared/image/icon/defaultFavicon.svg'} />
            <PanelListItemText>
                <a className={'popup__listitem_text_inner'} href={url} title={tooltiptext} onClick={onClick}>
                    {item.title}
                </a>
            </PanelListItemText>
        </PanelListItem>
    );
}

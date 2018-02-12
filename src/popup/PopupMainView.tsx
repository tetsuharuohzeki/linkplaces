import * as React from 'react';
import { Store } from 'redux';
//import * as PropTypes from 'prop-types';

import { BookmarkTreeNode, BookmarkTreeNodeItem, BookmarkTreeNodeFolder } from '../../typings/webext/bookmarks';

import { isBookmarkTreeNodeSeparator, isBookmarkTreeNodeItem } from '../shared/Bookmark';

import {
    ReactPopupFolderIconElement,
    ReactPopupItemIconElement,
} from './component/PopupIconElement';

import { PopupMainState, PopupMainStateTree } from './PopupMainState';
import { openItem, openLibraryWindow, openWebExtSidebar } from './PopupMainThunk';

export interface PopupMainViewProps {
    state: PopupMainState;
    store: Store<PopupMainStateTree>;
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
        <div className={'panel'}>
            <div className={'panel-section panel-section-list'}>
                <div className={'panel-list-item'} onClick={onClickOpenWebExtSidebar}>
                    <ReactPopupItemIconElement data-src={'../shared/image/icon/sidebar-16.svg'} />
                    <div className={'text'}>
                        <span className={'popup__listitem_text_inner'}>
                            {'View LinkPlaces Sidebar'}
                        </span>
                    </div>
                </div>
            </div>
            <div className={'panel-section panel-section-list'}>
                {items}
            </div>
        </div>
    );
}
(PopupMainView as React.StatelessComponent<PopupMainViewProps>).propTypes = {
};

interface ListItemProps {
    item: BookmarkTreeNode;
    store: Store<PopupMainStateTree>;
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
    store: Store<PopupMainStateTree>;
}
function FolderListItem(props: FolderListItemProps): JSX.Element {
    const { item, store } = props;

    const id = item.id;

    const onClick = (event: React.SyntheticEvent<HTMLDivElement>) => {
        event.preventDefault();

        const a = openLibraryWindow(id);
        store.dispatch(a);
    };

    // http://design.firefox.com/StyleGuide/#/navigation
    return (
        <div className={'panel-list-item'} onClick={onClick}>
            <ReactPopupFolderIconElement data-src={'../shared/image/icon/folder-16.svg'} />
            <div className={'text'}>
                <span className={'popup__listitem_text_inner'}>
                    {item.title}
                </span>
            </div>
        </div>
    );
}

interface ItemListItemProps {
    item: BookmarkTreeNodeItem;
    store: Store<PopupMainStateTree>;
}
function ItemListItem(props: ItemListItemProps): JSX.Element {
    const { item, store } = props;
    const url = item.url;
    const id = item.id;

    const onClick = (event: React.SyntheticEvent<HTMLAnchorElement>) => {
        event.preventDefault();

        const a = openItem(id, url);
        store.dispatch(a);
    };

    const title = item.title;
    const tooltiptext = `"${title}"\n${url}`;

    // http://design.firefox.com/StyleGuide/#/navigation
    return (
        <div className={'panel-list-item'}>
            <ReactPopupItemIconElement data-src={'../shared/image/icon/identity-not-secure.svg'} />
            <div className={'text'}>
                <a className={'popup__listitem_text_inner'} href={url} title={tooltiptext} onClick={onClick}>
                    {item.title}
                </a>
            </div>
        </div>
    );
}

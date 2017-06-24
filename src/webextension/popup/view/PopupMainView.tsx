import * as React from 'react';
import { Store } from 'redux';
//import * as PropTypes from 'prop-types';

import { BookmarkTreeNode, BookmarkTreeNodeItem } from '../../../../typings/webext/bookmarks';

import { PopupMainState } from '../PopupMainState';
import { openItem, openSidebar } from '../PopupMainThunk';

export interface PopupMainViewProps {
    state: PopupMainState;
    store: Store<PopupMainState>;
    list: Array<BookmarkTreeNode>;
}

export function PopupMainView(props: Readonly<PopupMainViewProps>): JSX.Element {
    const onClick = (_event: React.MouseEvent<HTMLDivElement>) => {
        const a = openSidebar();
        props.store.dispatch(a);
    };

    const items = props.list.map((item, i) => {
        const v = <ListItem key={i} item={item} store={props.store}/>;
        return v;
    });

    return (
        <div className={'panel'}>
            <div className={'panel-section panel-section-footer'}>
                <div className={'panel-section-footer-button'}
                    onClick={onClick}>
                    {'View LinkPlaces Sidebar'}
                </div>
            </div>
            <div className={'panel-section panel-section-list'}>
                <ul>
                    <li>{'item 1'}</li>
                    <li>{'item 2'}</li>
                    <li>{'item 3'}</li>
                    {items}
                </ul>
            </div>
        </div>
    );
}
(PopupMainView as React.StatelessComponent<PopupMainViewProps>).propTypes = {
};

interface ListItemProps {
    item: BookmarkTreeNode;
    store: Store<PopupMainState>;
}
function ListItem(props: ListItemProps): JSX.Element {
    const { item, store, } = props;
    const id = item.id;
    const url = (item as BookmarkTreeNodeItem).url;

    const onClick = (event: React.SyntheticEvent<HTMLAnchorElement>) => {
        event.preventDefault();

        const a = openItem(id, url);
        store.dispatch(a);
    };

    return (
        <li className={'popup__listitem'}>
            <a className={''} href={url} onClick={onClick}>
                {item.title}
            </a>
        </li>
    );
}

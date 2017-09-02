import * as React from 'react';
//import * as PropTypes from 'prop-types';

import { BookmarkTreeNode, BookmarkTreeNodeItem } from '../../../typings/webext/bookmarks';

import { isBookmarkTreeNodeItem } from '../shared/Bookmark';

import { SidebarIntent, notifyOpenItem } from './SidebarIntent';
import { SidebarState } from './SidebarState';

export interface SidebarViewProps {
    state:  Readonly<SidebarState>;
    intent: SidebarIntent;
}

export function SidebarView(props: Readonly<SidebarViewProps>): JSX.Element {
    const items = props.state.list.map((item, i) => {
        const v = <ListItem key={i} item={item} intent={props.intent}/>;
        return v;
    });

    return (
        <ul className={'sidebar__list_container'}>
            {items}
        </ul>
    );
}
(SidebarView as React.StatelessComponent<SidebarViewProps>).propTypes = {
};

interface ListItemProps {
    item: BookmarkTreeNode;
    intent: SidebarIntent;
}
function ListItem(props: ListItemProps): JSX.Element {
    const { item, intent, } = props;
    const id = item.id;
    const url = (item as BookmarkTreeNodeItem).url;

    let onClick: (e: React.SyntheticEvent<HTMLAnchorElement>) => void;
    if (isBookmarkTreeNodeItem(item)) {
        onClick = (evt) => {
            evt.preventDefault();

            const a = notifyOpenItem(id, url);
            intent.dispatch(a);
        };
    }
    else {
        onClick = (evt) => {
            evt.preventDefault();
        };
    }

    const title = `${item.title}\n${url}`;
    return (
        <li className={'sidebar__listitem_container'}>
            <a className={'sidebar__listitem_text_inner'} href={url} onClick={onClick} title={title}>
                {item.title}
            </a>
        </li>
    );
}

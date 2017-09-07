import * as React from 'react';
//import * as PropTypes from 'prop-types';

import { BookmarkTreeNodeItem } from '../../../typings/webext/bookmarks';

import {
    isBookmarkTreeNodeItem,
    isBookmarkTreeNodeSeparator,
} from '../shared/Bookmark';

import { SidebarItemViewValue } from './SidebarDomain';
import { SidebarIntent, notifyOpenItem } from './SidebarIntent';
import { SidebarState } from './SidebarState';

export interface SidebarViewProps {
    state:  Readonly<SidebarState>;
    intent: SidebarIntent;
}

export function SidebarView(props: Readonly<SidebarViewProps>): JSX.Element {
    const items: Array<Array<JSX.Element> | null> = [
    ];
    let level = 0;
    for (let list = props.state.list, i = 0, l = list.length; i < l; ++i) {
        const item = list[i];
        let inner = items[level];
        if (inner === undefined) {
            inner = [];
            items[level] = inner;
        }
        else if (inner === null) {
            throw new TypeError();
        }

        if (isBookmarkTreeNodeSeparator(item.bookmark)) {
            items.push(null);
            level = level + 2;
            items[level] = [];
        }
        else {
            const v = <ListItem key={i} item={item} intent={props.intent}/>;
            inner.push(v);
        }
    }

    const r: Array<JSX.Element> = [];
    for (const inner of items) {
        if (inner === null) {
            r.push(<hr/>);
        }
        else {
            r.push(
                <ul className={'sidebar__list_container'}>
                    {inner}
                </ul>
            );
        }
    }
    return (
        <div>
            {r}
        </div>
    );
}
(SidebarView as React.StatelessComponent<SidebarViewProps>).propTypes = {
};

interface ListItemProps {
    item: SidebarItemViewValue;
    intent: SidebarIntent;
}
function ListItem(props: ListItemProps): JSX.Element {
    const { item, intent, } = props;
    const bookmark = item.bookmark;
    const id = bookmark.id;
    const url = (bookmark as BookmarkTreeNodeItem).url;

    let onClick: (e: React.SyntheticEvent<HTMLAnchorElement>) => void;
    if (isBookmarkTreeNodeItem(bookmark)) {
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

    const title = `${bookmark.title}\n${url}`;

    let outerClass = 'sidebar__listitem_container';
    let innerClass = 'sidebar__listitem_text_inner';
    if (item.isSelected) {
        outerClass += ' .sidebar__listitem_container--is_selected';
        innerClass += ' .sidebar__listitem_text_inner--is_selected';
    }

    return (
        <li className={outerClass}>
            <a className={innerClass} href={url} onClick={onClick} title={title}>
                {bookmark.title}
            </a>
        </li>
    );
}

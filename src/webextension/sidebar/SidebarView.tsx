import * as React from 'react';
//import * as PropTypes from 'prop-types';

import { BookmarkTreeNodeItem } from '../../../typings/webext/bookmarks';

import { isBookmarkTreeNodeItem } from '../shared/Bookmark';

import { SidebarItemViewValue } from './SidebarDomain';
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

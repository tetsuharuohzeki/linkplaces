import * as React from 'react';
//import * as PropTypes from 'prop-types';

import { BookmarkTreeNode, BookmarkTreeNodeItem } from '../../../typings/webext/bookmarks';

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
        <ul>
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

    const onClick = (_: React.SyntheticEvent<HTMLAnchorElement>) => {
        const a = notifyOpenItem(id, url);
        intent.dispatch(a);
    };

    return (
        <li className={''}>
            <a className={''} href={url} onClick={onClick}>
                {item.title}
            </a>
        </li>
    );
}

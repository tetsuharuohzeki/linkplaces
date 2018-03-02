import { IterableX } from '@reactivex/ix-esnext-esm/iterable/iterablex';
import { map } from '@reactivex/ix-esnext-esm/iterable/pipe/map';
import { toArray as toArrayFromIx } from '@reactivex/ix-esnext-esm/iterable/toarray';

import { Nullable, isNull, isNotNull } from 'option-t/esm/Nullable/Nullable';

import React from 'react';
//import * as PropTypes from 'prop-types';

import {
    isBookmarkTreeNodeItem,
    isBookmarkTreeNodeSeparator,
} from '../shared/Bookmark';
import {
    WhereToOpenItem,
    WHERE_TO_OPEN_ITEM_TO_TAB,
    WHERE_TO_OPEN_ITEM_TO_WINDOW,
} from '../shared/RemoteAction';

import { SidebarItemViewModelEntity } from './SidebarDomain';
import { SidebarIntent, notifyOpenItem } from './SidebarIntent';
import { SidebarState } from './SidebarState';

export interface SidebarViewProps {
    state:  Readonly<SidebarState>;
    intent: SidebarIntent;
}

export function SidebarView(props: Readonly<SidebarViewProps>): JSX.Element {
    const mapped = IterableX.from(props.state.list)
        .pipe(
            map((item, i) => {
                if (isBookmarkTreeNodeSeparator(item.bookmark)) {
                    return (<ListItem key={i} item={null} intent={props.intent}/>);
                }
                else {
                    return (<ListItem key={i} item={item} intent={props.intent}/>);
                }
            }),
        );

    const r: Array<JSX.Element> = toArrayFromIx(mapped);
    return (
        <div>
            <ul className={'sidebar__list_container'}>
                {r}
            </ul>
        </div>
    );
}
(SidebarView as React.StatelessComponent<SidebarViewProps>).propTypes = {
};

interface ListItemProps {
    item: Nullable<SidebarItemViewModelEntity>;
    intent: SidebarIntent;
}
function ListItem(props: ListItemProps): JSX.Element {
    const { item, intent, } = props;
    const outerClass = [
        'sidebar__listitem_container',
    ];

    if (isNotNull(item)) {
        if (item.isSelected) {
            outerClass.push('sidebar__listitem_container--is_selected');
        }
        else if (item.isOpening) {
            outerClass.push('sidebar__listitem_container--is_opening');
        }
    }
    else {
        outerClass.push('sidebar__listitem_text_inner--is_separator');
    }

    return (
        <li className={outerClass.join(' ')}>
            <ListItemInner item={item} intent={intent}/>
        </li>
    );
}

interface ListItemInnerProps {
    item: Nullable<SidebarItemViewModelEntity>;
    intent: SidebarIntent;
}
function ListItemInner(props: ListItemInnerProps): JSX.Element {
    const { item, intent, } = props;
    if (isNull(item)) {
        return <hr />;
    }

    let innerClass = 'sidebar__listitem_text_inner';

    const bookmark = item.bookmark;
    if (!isBookmarkTreeNodeItem(bookmark)) {
        return (
            <span className={innerClass}>
                {bookmark.title}
            </span>
        );
    }

    const id = bookmark.id;
    const url = bookmark.url;
    const title = `${bookmark.title}\n${url}`;

    if (item.isOpening) {
        return (
            <span className={innerClass} title={title}>
                {bookmark.title}
            </span>
        );
    }

    let onClick: React.MouseEventHandler<HTMLAnchorElement>;
    if (isBookmarkTreeNodeItem(bookmark)) {
        onClick = (evt) => {
            evt.preventDefault();

            const where = whereToOpenItem(evt);
            const a = notifyOpenItem(id, url, where);
            intent.dispatch(a);
        };
    }
    else {
        onClick = (evt) => {
            evt.preventDefault();
        };
    }

    if (item.isSelected) {
        innerClass += ' sidebar__listitem_text_inner--is_selected';
    }

    return (
        <a className={innerClass} href={url} onClick={onClick} title={title}>
            {bookmark.title}
        </a>
    );
}

function whereToOpenItem(syntheticEvent: React.MouseEvent<HTMLAnchorElement>): WhereToOpenItem {
    if (syntheticEvent.shiftKey) {
        return WHERE_TO_OPEN_ITEM_TO_WINDOW;
    }

    return WHERE_TO_OPEN_ITEM_TO_TAB;
}

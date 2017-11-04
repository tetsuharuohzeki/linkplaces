import { IterableX } from '@reactivex/ix-esnext-esm/iterable/iterablex';
import { map } from '@reactivex/ix-esnext-esm/iterable/pipe/map';
import { toArray as toArrayFromIx } from '@reactivex/ix-esnext-esm/iterable/toarray';

import { Nullable, isNull } from 'option-t/esm/Nullable/Nullable';
import { mapOrElseForNullable } from 'option-t/esm/Nullable/mapOrElse';
import { isUndefined } from 'option-t/esm/Undefinable/Undefinable';

import * as React from 'react';
//import * as PropTypes from 'prop-types';

import { BookmarkTreeNodeItem } from '../../typings/webext/bookmarks';

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
    const items: Array<Nullable<Array<JSX.Element>>> = [];
    let level = 0;
    for (const [i, item] of props.state.list.entries()) {
        let inner = items[level];
        if (isUndefined(inner)) {
            inner = [];
            items[level] = inner;
        }
        else if (isNull(inner)) {
            throw new TypeError();
        }

        if (isBookmarkTreeNodeSeparator(item.bookmark)) {
            items.push(null);
            level = level + 2; // tslint:disable-line:no-magic-numbers
            items[level] = [];
        }
        else {
            const v = <ListItem key={i} item={item} intent={props.intent}/>;
            inner.push(v);
        }
    }

    const mapped = IterableX.from(items).pipe(
        map((inner: Nullable<Array<JSX.Element>>) => {
            const element = mapOrElseForNullable(inner, () => {
                return (<hr/>);
            }, (inner) => {
                return (
                    <ul className={'sidebar__list_container'}>
                        {inner}
                    </ul>
                );
            });
            return element;
        })
    );

    const r: Array<JSX.Element> = toArrayFromIx(mapped);

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

    if (item.isOpening) {
        outerClass += 'sidebar__listitem_container--is_opening';

        return (
            <li className={outerClass}>
                <span className={innerClass} title={title}>
                    {bookmark.title}
                </span>
            </li>
        );
    }


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

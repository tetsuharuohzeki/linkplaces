import { IterableX } from '@reactivex/ix-esnext-esm/iterable/iterablex';
import { map } from '@reactivex/ix-esnext-esm/iterable/pipe/map';
import { toArray as toArrayFromIx } from '@reactivex/ix-esnext-esm/iterable/toarray';

import React from 'react';

import {
    isBookmarkTreeNodeItem,
    isBookmarkTreeNodeSeparator,
} from '../shared/Bookmark';
import {
    WhereToOpenItem,
    WHERE_TO_OPEN_ITEM_TO_TAB,
    WHERE_TO_OPEN_ITEM_TO_WINDOW,
} from '../shared/RemoteAction';
import { PanelSectionList, PanelSectionListSeparator } from '../shared/component/PanelSectionList';
import {
    PanelListItem,
    PanelListItemIcon,
    PanelListItemText,
} from '../shared/component/PanelListItem';

import { SidebarItemViewModelEntity } from './SidebarDomain';
import { SidebarIntent, notifyOpenItem } from './SidebarIntent';
import { SidebarState } from './SidebarState';

export interface SidebarViewProps {
    state: Readonly<SidebarState>;
    intent: SidebarIntent;
}

export function SidebarView(props: Readonly<SidebarViewProps>): JSX.Element {
    const mapped = IterableX.from(props.state.list)
        .pipe(
            map((item, i) => {
                return (
                    <ListItem key={i} item={item} intent={props.intent} />
                );
            }),
        );

    const r: Array<JSX.Element> = toArrayFromIx(mapped);
    return (
        <div className={'sidebar-c-SidebarView__container'}>
            <PanelSectionList>
                {r}
            </PanelSectionList>
        </div>
    );
}

interface ListItemProps {
    item: SidebarItemViewModelEntity;
    intent: SidebarIntent;
}
function ListItem(props: ListItemProps): JSX.Element {
    const { item, intent, } = props;
    const bookmark = item.bookmark;

    if (isBookmarkTreeNodeSeparator(bookmark)) {
        return (
            <PanelSectionListSeparator />
        );
    }

    const bookmarkTitle = bookmark.title;

    let iconSrc;
    let labelText: JSX.Element;

    if (isBookmarkTreeNodeItem(bookmark)) {
        const id = bookmark.id;
        const url = bookmark.url;
        const title = `${bookmarkTitle}\n${url}`;

        const onClick: React.MouseEventHandler<HTMLAnchorElement> = (evt) => {
            evt.preventDefault();

            const where = whereToOpenItem(evt);
            const a = notifyOpenItem(id, url, where);
            intent.dispatch(a);
        };

        const label = (bookmarkTitle === '') ?
            url :
            bookmarkTitle;
        iconSrc = '../shared/image/icon/defaultFavicon.svg';
        labelText = (
            <a href={url} onClick={onClick} title={title}>
                {label}
            </a>
        );
    } else {
        iconSrc = '../shared/image/icon/folder-16.svg';
        labelText = (
            <span title={bookmarkTitle}>
                {bookmarkTitle}
            </span>
        );
    }

    const isOpening = item.isOpening;
    return (
        <PanelListItem disabled={isOpening}>
            <PanelListItemIcon>
                <img alt={''} src={iconSrc} />
            </PanelListItemIcon>
            <PanelListItemText>
                {labelText}
            </PanelListItemText>
        </PanelListItem>
    );
}

function whereToOpenItem(syntheticEvent: React.MouseEvent<HTMLAnchorElement>): WhereToOpenItem {
    if (syntheticEvent.shiftKey) {
        return WHERE_TO_OPEN_ITEM_TO_WINDOW;
    }

    return WHERE_TO_OPEN_ITEM_TO_TAB;
}

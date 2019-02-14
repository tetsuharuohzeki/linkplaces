import { IterableX } from '@reactivex/ix-esnext-esm/iterable/iterablex';
import { map } from '@reactivex/ix-esnext-esm/iterable/pipe/map';
import { toArray as toArrayFromIx } from '@reactivex/ix-esnext-esm/iterable/toarray';

import { Nullable } from 'option-t/esm/Nullable/Nullable';

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
function ListItem(props: ListItemProps): Nullable<JSX.Element> {
    const { item, intent, } = props;
    const isOpening = item.isOpening;
    if (isOpening) {
        return null;
    }

    const bookmark = item.bookmark;

    if (isBookmarkTreeNodeSeparator(bookmark)) {
        return (
            <PanelSectionListSeparator />
        );
    }

    const bookmarkTitle = bookmark.title;

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
        const iconSrc = '../shared/image/icon/defaultFavicon.svg';
        return (
            <a
                className={'sidebar-c-ListItem__container'}
                href={url}
                onClick={onClick}
                title={title}>
                <ListBaseItem
                    isOpening={isOpening}
                    iconSrc={iconSrc}
                    label={label}
                />
            </a>
        );
    }

    const iconSrc = '../shared/image/icon/folder-16.svg';
    return (
        <span
            className={'sidebar-c-ListItem__container'}
            title={bookmarkTitle}>
            <ListBaseItem
                isOpening={isOpening}
                iconSrc={iconSrc}
                label={bookmarkTitle}
            />
        </span>
    );
}

interface ListBaseItemProps {
    isOpening: boolean;
    iconSrc: string;
    label: string;
}

function ListBaseItem(props: ListBaseItemProps): JSX.Element {
    const {
        isOpening,
        iconSrc,
        label,
    } = props;

    return (
        <React.StrictMode>
            <PanelListItem disabled={isOpening}>
                <PanelListItemIcon>
                    <img alt={''} src={iconSrc} />
                </PanelListItemIcon>
                <PanelListItemText>
                    {label}
                </PanelListItemText>
            </PanelListItem>
        </React.StrictMode>
    );
}

function whereToOpenItem(syntheticEvent: React.MouseEvent<HTMLAnchorElement>): WhereToOpenItem {
    if (syntheticEvent.shiftKey) {
        return WHERE_TO_OPEN_ITEM_TO_WINDOW;
    }

    return WHERE_TO_OPEN_ITEM_TO_TAB;
}

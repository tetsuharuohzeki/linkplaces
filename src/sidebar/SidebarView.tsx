import { IterableX } from '@reactivex/ix-esnext-esm/iterable/iterablex';
import { map } from '@reactivex/ix-esnext-esm/iterable/pipe/map';
import { toArray as toArrayFromIx } from '@reactivex/ix-esnext-esm/iterable/toarray';

import { Nullable, isNull } from 'option-t/esm/Nullable/Nullable';
import { mapOrForNullable } from 'option-t/esm/Nullable/mapOr';

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

import { PanelSectionList, PanelSectionListSeparator } from '../shared/component/PanelSectionList';
import {
    PanelListItem,
    PanelListItemIcon,
    PanelListItemText,
} from '../shared/component/PanelListItem';

export interface SidebarViewProps {
    state: Readonly<SidebarState>;
    intent: SidebarIntent;
}

export function SidebarView(props: Readonly<SidebarViewProps>): JSX.Element {
    const mapped = IterableX.from(props.state.list)
        .pipe(
            map((item, i) => {
                if (isBookmarkTreeNodeSeparator(item.bookmark)) {
                    return (<ListItem key={i} item={null} intent={props.intent} />);
                }
                else {
                    return (<ListItem key={i} item={item} intent={props.intent} />);
                }
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
// FIXME: PropTypes is too strict.
// (SidebarView as React.StatelessComponent<SidebarViewProps>).propTypes = {};

interface ListItemProps {
    item: Nullable<SidebarItemViewModelEntity>;
    intent: SidebarIntent;
}
function ListItem(props: ListItemProps): JSX.Element {
    const { item, intent, } = props;

    if (isNull(item)) {
        return (
            <PanelSectionListSeparator />
        );
    }

    const isOpening = mapOrForNullable(item, false, (item) => item.isOpening);

    return (
        <PanelListItem disabled={isOpening}>
            <ListItemInner item={item} intent={intent} />
        </PanelListItem>
    );
}

interface ListItemInnerProps {
    item: SidebarItemViewModelEntity;
    intent: SidebarIntent;
}
function ListItemInner(props: ListItemInnerProps): JSX.Element {
    const { item, intent, } = props;
    const bookmark = item.bookmark;
    if (!isBookmarkTreeNodeItem(bookmark)) {
        const title = bookmark.title;
        return (
            <React.Fragment>
                <PanelListItemIcon>
                    <img alt={''} src={'../shared/image/icon/folder-16.svg'} />
                </PanelListItemIcon>
                <PanelListItemText>
                    <span title={title}>
                        {title}
                    </span>
                </PanelListItemText>
            </React.Fragment>
        );
    }

    const id = bookmark.id;
    const url = bookmark.url;
    const title = `${bookmark.title}\n${url}`;

    if (item.isOpening) {
        return (
            <React.Fragment>
                <PanelListItemIcon>
                    <img alt={''} src={'../shared/image/icon/folder-16.svg'} />
                </PanelListItemIcon>
                <PanelListItemText>
                    <span title={title}>
                        {bookmark.title}
                    </span>
                </PanelListItemText>
            </React.Fragment>
        );
    }

    let icon: JSX.Element;
    let onClick: React.MouseEventHandler<HTMLAnchorElement>;
    if (isBookmarkTreeNodeItem(bookmark)) {
        icon = <img alt={''} src={'../shared/image/icon/defaultFavicon.svg'} />;
        onClick = (evt) => {
            evt.preventDefault();

            const where = whereToOpenItem(evt);
            const a = notifyOpenItem(id, url, where);
            intent.dispatch(a);
        };
    }
    else {
        icon = <img alt={''} src={'../shared/image/icon/folder-16.svg'} />;
        onClick = (evt) => {
            evt.preventDefault();
        };
    }

    return (
        <React.Fragment>
            <PanelListItemIcon>
                {icon}
            </PanelListItemIcon>
            <PanelListItemText>
                <a href={url} onClick={onClick} title={title}>
                    {bookmark.title}
                </a>
            </PanelListItemText>
        </React.Fragment>
    );
}

function whereToOpenItem(syntheticEvent: React.MouseEvent<HTMLAnchorElement>): WhereToOpenItem {
    if (syntheticEvent.shiftKey) {
        return WHERE_TO_OPEN_ITEM_TO_WINDOW;
    }

    return WHERE_TO_OPEN_ITEM_TO_TAB;
}

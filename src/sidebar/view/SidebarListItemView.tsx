import { Nullable } from 'option-t/esm/Nullable/Nullable';
import React from 'react';

import {
    PanelListItem,
    PanelListItemIcon,
    PanelListItemText,
} from '../../shared/component/PanelListItem';
import { isBookmarkTreeNodeSeparator, isBookmarkTreeNodeItem } from '../../shared/Bookmark';
import { PanelSectionListSeparator } from '../../shared/component/PanelSectionList';
import { WhereToOpenItem, WHERE_TO_OPEN_ITEM_TO_WINDOW, WHERE_TO_OPEN_ITEM_TO_TAB } from '../../shared/RemoteAction';

import { SidebarItemViewModelEntity } from '../SidebarDomain';
import { SidebarIntent, notifyOpenItem } from '../SidebarIntent';

const CLASS_NAME_PREFIX = 'sidebar-com-SidebarListItemView';

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
                    <picture className={`${CLASS_NAME_PREFIX}__icon_img`}>
                        <img alt={''} src={iconSrc} />
                    </picture>
                </PanelListItemIcon>
                <PanelListItemText>
                    {label}
                </PanelListItemText>
            </PanelListItem>
        </React.StrictMode>
    );
}

interface ListItemProps {
    item: SidebarItemViewModelEntity;
    intent: SidebarIntent;
}
export function ListItem(props: ListItemProps): Nullable<JSX.Element> {
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
        const iconSrc = '../shared/image/icon/light/globe-16.svg';
        return (
            <a
                className={`${CLASS_NAME_PREFIX}__container`}
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

    const iconSrc = '../shared/image/icon/light/folder-16.svg';
    return (
        <span
            className={`${CLASS_NAME_PREFIX}__container`}
            title={bookmarkTitle}>
            <ListBaseItem
                isOpening={isOpening}
                iconSrc={iconSrc}
                label={bookmarkTitle}
            />
        </span>
    );
}

function whereToOpenItem(syntheticEvent: React.MouseEvent<HTMLAnchorElement>): WhereToOpenItem {
    if (syntheticEvent.shiftKey) {
        return WHERE_TO_OPEN_ITEM_TO_WINDOW;
    }

    return WHERE_TO_OPEN_ITEM_TO_TAB;
}

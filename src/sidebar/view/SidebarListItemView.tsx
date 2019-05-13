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
    iconDir: string;
    iconFile: string;
    label: string;
}

function ListBaseItem(props: ListBaseItemProps): JSX.Element {
    const {
        isOpening,
        iconDir,
        iconFile,
        label,
    } = props;

    if (!iconDir.endsWith('/')) {
        throw new URIError(`iconDir: \`${iconDir}\` should be ended with /`);
    }

    if (iconFile.startsWith('/')) {
        throw new URIError(`iconFile: \`${iconFile}\` should not be started with /`);
    }

    return (
        <React.StrictMode>
            <PanelListItem disabled={isOpening}>
                <PanelListItemIcon>
                    <svg viewBox={'0 0 16 16'} width={'16'} height={'16'} className={`${CLASS_NAME_PREFIX}__icon_img`}>
                        <use href={`${iconDir}context-fill/${iconFile}#icon`} />
                    </svg>
                </PanelListItemIcon>
                <PanelListItemText>
                    {label}
                </PanelListItemText>
            </PanelListItem>
        </React.StrictMode>
    );
}

const ICON_DIR = '../resources/icon/';

interface ListItemProps {
    item: SidebarItemViewModelEntity;
    intent: SidebarIntent;
}
export function ListItem(props: ListItemProps): Nullable<JSX.Element> {
    const { item, intent, } = props;
    const [isOpening, setIsOpening] = React.useState<boolean>(false);
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

            const where = calculateWhereToOpenItem(evt);
            const a = notifyOpenItem(id, url, where);

            intent.dispatch(a);

            setIsOpening(true);
        };

        const label = (bookmarkTitle === '') ?
            url :
            bookmarkTitle;
        return (
            <React.StrictMode>
                <a
                    className={`${CLASS_NAME_PREFIX}__container`}
                    href={url}
                    onClick={onClick}
                    title={title}>
                    <ListBaseItem
                        isOpening={isOpening}
                        iconDir={ICON_DIR}
                        iconFile={'globe-16.svg'}
                        label={label}
                    />
                </a>
            </React.StrictMode>
        );
    }

    return (
        <React.StrictMode>
            <span
                className={`${CLASS_NAME_PREFIX}__container`}
                title={bookmarkTitle}>
                <ListBaseItem
                    isOpening={isOpening}
                    iconDir={ICON_DIR}
                    iconFile={'folder-16.svg'}
                    label={bookmarkTitle}
                />
            </span>
        </React.StrictMode>
    );
}

function calculateWhereToOpenItem(syntheticEvent: React.MouseEvent<HTMLAnchorElement>): WhereToOpenItem {
    if (syntheticEvent.shiftKey) {
        return WHERE_TO_OPEN_ITEM_TO_WINDOW;
    }

    return WHERE_TO_OPEN_ITEM_TO_TAB;
}

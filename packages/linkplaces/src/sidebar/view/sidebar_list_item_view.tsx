import { WhereToOpenItem } from '@linkplaces/ipc_message';
import { isBookmarkTreeNodeSeparator, isBookmarkTreeNodeItem } from '@linkplaces/shared/bookmark';
import {
    PanelListItem,
    PanelListItemIcon,
    PanelListItemText,
    PanelSectionListSeparator,
} from '@linkplaces/shared/component';
import type { BookmarkTreeNodeItem, BookmarkTreeNodeFolder } from '@linkplaces/webext_types';

import { StrictMode, useState, type MouseEventHandler, type MouseEvent, type ReactNode } from 'react';

import type { SidebarItemViewModelEntity } from '../sidebar_domain.js';
import type { SidebarIntent } from '../sidebar_intent.js';

const CLASS_NAME_PREFIX = 'sidebar-com-SidebarListItemView';
const CLASS_NAME_CONTAINER = `${CLASS_NAME_PREFIX}__container`;

interface ListBaseItemProps {
    iconDir: string;
    iconFile: string;
    label: string;
}

function ListBaseItem(props: ListBaseItemProps): ReactNode {
    const { iconDir, iconFile, label } = props;

    if (!iconDir.endsWith('/')) {
        throw new URIError(`iconDir: \`${iconDir}\` should be ended with /`);
    }

    if (iconFile.startsWith('/')) {
        throw new URIError(`iconFile: \`${iconFile}\` should not be started with /`);
    }

    return (
        <StrictMode>
            <PanelListItem>
                <PanelListItemIcon>
                    <picture className={`${CLASS_NAME_PREFIX}__icon_img`}>
                        <source
                            srcSet={`${iconDir}dark/${iconFile}`}
                            media={'(prefers-color-scheme: dark)'}
                        />
                        <source
                            srcSet={`${iconDir}light/${iconFile}`}
                            media={'(prefers-color-scheme: light)'}
                        />
                        <img
                            alt={''}
                            src={`${iconDir}context-fill/${iconFile}`}
                        />
                    </picture>
                </PanelListItemIcon>
                <PanelListItemText>{label}</PanelListItemText>
            </PanelListItem>
        </StrictMode>
    );
}

const ICON_DIR = '../resources/icon/';

interface ListItemProps {
    item: SidebarItemViewModelEntity;
    intent: SidebarIntent;
}
export function ListItem(props: ListItemProps): ReactNode {
    const { item, intent } = props;
    const bookmark = item.bookmark;

    if (isBookmarkTreeNodeSeparator(bookmark)) {
        return <PanelSectionListSeparator />;
    }

    if (isBookmarkTreeNodeItem(bookmark)) {
        return (
            <StrictMode>
                <ListItemForBookmarkItem
                    bookmark={bookmark}
                    intent={intent}
                />
            </StrictMode>
        );
    }

    return (
        <StrictMode>
            <ListItemForBookmarkFolder bookmark={bookmark} />
        </StrictMode>
    );
}

interface ListItemForBookmarkItemProps {
    bookmark: BookmarkTreeNodeItem;
    intent: SidebarIntent;
}

function ListItemForBookmarkItem(props: ListItemForBookmarkItemProps) {
    const [isOpening, setIsOpening] = useState<boolean>(false);
    if (isOpening) {
        return null;
    }

    const { bookmark, intent } = props;
    const id = bookmark.id;
    const url = bookmark.url;
    const bookmarkTitle = bookmark.title;
    const title = `${bookmarkTitle}\n${url}`;

    const onClick: MouseEventHandler<HTMLAnchorElement> = (evt) => {
        evt.preventDefault();

        const where = calculateWhereToOpenItem(evt);
        intent.openItem(id, url, where);

        setIsOpening(true);
    };

    const label = bookmarkTitle === '' ? url : bookmarkTitle;

    return (
        <StrictMode>
            <a
                className={CLASS_NAME_CONTAINER}
                href={url}
                onClick={onClick}
                title={title}
            >
                <ListBaseItem
                    iconDir={ICON_DIR}
                    iconFile={'defaultFavicon.svg'}
                    label={label}
                />
            </a>
        </StrictMode>
    );
}

function calculateWhereToOpenItem(syntheticEvent: MouseEvent<HTMLAnchorElement>): WhereToOpenItem {
    if (syntheticEvent.shiftKey) {
        return WhereToOpenItem.Window;
    }

    return WhereToOpenItem.Tab;
}

interface ListItemForBookmarkFolderProps {
    bookmark: BookmarkTreeNodeFolder;
}

function ListItemForBookmarkFolder(props: ListItemForBookmarkFolderProps) {
    const { bookmark } = props;
    const bookmarkTitle = bookmark.title;
    return (
        <StrictMode>
            <span
                className={CLASS_NAME_CONTAINER}
                title={bookmarkTitle}
            >
                <ListBaseItem
                    iconDir={ICON_DIR}
                    iconFile={'folder.svg'}
                    label={bookmarkTitle}
                />
            </span>
        </StrictMode>
    );
}

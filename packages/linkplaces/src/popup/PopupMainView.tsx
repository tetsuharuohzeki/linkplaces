import { isBookmarkTreeNodeSeparator, isBookmarkTreeNodeItem } from '@linkplaces/shared/bookmark';
import {
    PanelListItem,
    PanelListItemIcon,
    PanelListItemText,
    PanelSectionList,
    PanelSectionListSeparator,
} from '@linkplaces/shared/component';
import type { BookmarkTreeNode, BookmarkTreeNodeItem, BookmarkTreeNodeFolder } from '@linkplaces/webext_types';

import { StrictMode, type MouseEvent, type MouseEventHandler, useState, type ReactNode } from 'react';

import type { PopupMainIntent } from './PopupMainIntent.js';
import type { PopupMainState } from './PopupMainState.js';
import { PopupItemIcon } from './component/PopupIconElement.js';

const ICON_DIR = '../resources/icon/';

const CLASS_NAME_CONTAINER = 'popup-c-PopupMainView-ItemListItem__container';

export interface PopupMainViewProps {
    state: PopupMainState;
    intent: PopupMainIntent;
}

export function PopupMainView(props: Readonly<PopupMainViewProps>): ReactNode {
    const { state, intent } = props;

    const onClickOpenWebExtSidebar = (_event: MouseEvent<HTMLDivElement>) => {
        intent.openWebExtSidebar().catch(console.error);
    };

    const items = state.list.map((item, i) => {
        const key = `PopupMainView-${String(i)}`;
        const v = (
            <ListItem
                key={key}
                item={item}
                intent={intent}
            />
        );
        return v;
    });

    return (
        <StrictMode>
            <main>
                <Header onClick={onClickOpenWebExtSidebar} />
                <PanelSectionListSeparator />
                <PanelSectionList>{items}</PanelSectionList>
            </main>
        </StrictMode>
    );
}

interface HeaderProps {
    onClick: MouseEventHandler<HTMLElement>;
}

function Header(props: HeaderProps): ReactNode {
    return (
        <StrictMode>
            <div className={'popup-c-PopupMainView-Header__container'}>
                <PanelSectionList>
                    <PanelListItem onClick={props.onClick}>
                        <PanelListItemIcon>
                            <PopupItemIcon
                                icondir={ICON_DIR}
                                iconfile={'sidebars.svg'}
                            />
                        </PanelListItemIcon>
                        <PanelListItemText>{'View LinkPlaces Sidebar'}</PanelListItemText>
                    </PanelListItem>
                </PanelSectionList>
            </div>
        </StrictMode>
    );
}

interface ListItemProps {
    item: BookmarkTreeNode;
    intent: PopupMainIntent;
}
function ListItem(props: ListItemProps): ReactNode {
    const { item, intent } = props;

    let node: ReactNode;
    if (isBookmarkTreeNodeSeparator(item)) {
        node = <hr />;
    } else if (isBookmarkTreeNodeItem(item)) {
        node = (
            <ItemListItem
                item={item}
                intent={intent}
            />
        );
    } else {
        node = (
            <FolderListItem
                item={item}
                intent={intent}
            />
        );
    }

    return node;
}

interface FolderListItemProps {
    item: BookmarkTreeNodeFolder;
    intent: PopupMainIntent;
}
function FolderListItem(props: FolderListItemProps): ReactNode {
    const { item } = props;

    const onClick: MouseEventHandler<HTMLDivElement> = (event: MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        // FIXME: This should implement to transition to the given id folder.
    };

    // https://design.firefox.com/StyleGuide/#/navigation
    return (
        <StrictMode>
            <span className={CLASS_NAME_CONTAINER}>
                <PanelListItem onClick={onClick}>
                    <PanelListItemIcon>
                        <PopupItemIcon
                            icondir={ICON_DIR}
                            iconfile={'folder.svg'}
                        />
                    </PanelListItemIcon>
                    <PanelListItemText>{item.title}</PanelListItemText>
                </PanelListItem>
            </span>
        </StrictMode>
    );
}

interface ItemListItemProps {
    item: BookmarkTreeNodeItem;
    intent: PopupMainIntent;
}
function ItemListItem(props: ItemListItemProps): ReactNode {
    const { item, intent } = props;
    const url = item.url;
    const id = item.id;

    const [isOpening, setIsOpening] = useState<boolean>(false);
    if (isOpening) {
        return null;
    }

    const onClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
        event.preventDefault();

        intent.openItem(id, url).catch(console.error);

        setIsOpening(true);
    };

    const title = item.title;
    const tooltiptext = `"${title}"\n${url}`;
    const label = title === '' ? url : title;

    // https://design.firefox.com/StyleGuide/#/navigation
    return (
        <StrictMode>
            <a
                className={CLASS_NAME_CONTAINER}
                href={url}
                title={tooltiptext}
                onClick={onClick}
            >
                <PanelListItem>
                    <PanelListItemIcon>
                        <PopupItemIcon
                            icondir={ICON_DIR}
                            iconfile={'defaultFavicon.svg'}
                        />
                    </PanelListItemIcon>
                    <PanelListItemText>{label}</PanelListItemText>
                </PanelListItem>
            </a>
        </StrictMode>
    );
}

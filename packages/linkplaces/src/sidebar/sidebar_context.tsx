import type { ReactViewRenderFn, ReactViewTeardownFn } from '@linkplaces/foundation/view_ctx/react';
import type { RemoteActionChannel } from '@linkplaces/ipc_message';
import { browser, type BookmarkTreeNode } from '@linkplaces/webext_types';

import { StrictMode } from 'react';

import { SidebarRepository } from './repository/sidebar_repository.js';
import { SidebarViewUpdater } from './sidebar_context_view.jsx';
import { SidebarEpic } from './sidebar_epic.js';
import { SidebarIntent } from './sidebar_intent.js';
import { createSidebarStore } from './sidebar_store.js';

export async function initSidebarContext(
    render: ReactViewRenderFn,
    channel: RemoteActionChannel,
    list: Array<BookmarkTreeNode>
): Promise<ReactViewTeardownFn> {
    const repo = SidebarRepository.create(browser.bookmarks, list);
    const store = createSidebarStore(repo.latestValue());

    const epic = new SidebarEpic(channel, store);
    const intent = new SidebarIntent(epic, store);

    const view = (
        <StrictMode>
            <SidebarViewUpdater
                store={store}
                intent={intent}
                repo={repo}
            />
        </StrictMode>
    );

    render(view);

    return () => {
        store.destory();
        repo.destroy();
    };
}

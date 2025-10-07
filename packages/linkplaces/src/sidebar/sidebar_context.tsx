import type { ReactViewRenderFn, TeardownFn } from '@linkplaces/foundation/view_ctx/react';
import { browser, type BookmarkTreeNode } from '@linkplaces/webext_types';

import { StrictMode } from 'react';

import { SidebarRepository } from './repository/sidebar_repository.js';
import { SidebarViewUpdater } from './sidebar_context_view.jsx';
import { SidebarEpic } from './sidebar_epic.js';
import { SidebarIntent } from './sidebar_intent.js';
import type { RemoteActionChannel } from './sidebar_message_channel.js';
import { createSidebarStore } from './sidebar_store.js';

export async function initSidebarContext(
    render: ReactViewRenderFn,

    channel: RemoteActionChannel,
    list: Array<BookmarkTreeNode>
): Promise<TeardownFn> {
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

import { ReactRuledViewContext } from '@linkplaces/foundation/view_ctx/react';
import { browser, type BookmarkTreeNode } from '@linkplaces/webext_types';

import { StrictMode } from 'react';

import { SidebarRepository } from './repository/sidebar_repository.js';
import { SidebarViewUpdater } from './sidebar_context_view.jsx';
import { SidebarEpic } from './sidebar_epic.js';
import { SidebarIntent } from './sidebar_intent.js';
import type { RemoteActionChannel } from './sidebar_message_channel.js';
import { createSidebarStore } from './sidebar_store.js';

export class SidebarContext extends ReactRuledViewContext {
    private _channel: RemoteActionChannel;

    private _repo: SidebarRepository;

    constructor(list: Array<BookmarkTreeNode>, channel: RemoteActionChannel) {
        super();
        this._channel = channel;

        this._repo = SidebarRepository.create(browser.bookmarks, list);
    }

    destroy(): void {
        this._repo.destroy();
        this._repo = null as never;
        this._channel = null as never;
    }

    async onActivate(mountpoint: Element): Promise<void> {
        this._initRenderRoot(mountpoint);

        const repo = this._repo;

        const store = createSidebarStore(repo.latestValue());

        const epic = new SidebarEpic(this._channel, store);
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

        const renderRoot = this._getRenderRoot();
        renderRoot.render(view);
    }

    async onDestroy(_mountpoint: Element): Promise<void> {
        this._destroyRenderRoot();
    }
}

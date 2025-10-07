import { ReactRuledViewContext } from '@linkplaces/foundation/view_ctx/ReactRuledViewContext';
import { browser, type BookmarkTreeNode } from '@linkplaces/webext_types';

import { StrictMode } from 'react';

import { SidebarViewUpdater } from './SidebarContextView.js';
import { SidebarEpic } from './SidebarEpic.js';
import { SidebarIntent } from './SidebarIntent.js';
import type { RemoteActionChannel } from './SidebarMessageChannel.js';
import { createSidebarStore } from './SidebarStore.js';
import { SidebarRepository } from './repository/SidebarRepository.js';

export class SidebarContext extends ReactRuledViewContext {
    private _list: Array<BookmarkTreeNode>;
    private _channel: RemoteActionChannel;

    private _repo: SidebarRepository;

    constructor(list: Array<BookmarkTreeNode>, channel: RemoteActionChannel) {
        super();
        this._list = list;
        this._channel = channel;

        this._repo = SidebarRepository.create(browser.bookmarks, list);
    }

    destroy(): void {
        this._repo.destroy();
        this._repo = null as never;
        this._channel = null as never;
        this._list = null as never;
    }

    async onActivate(mountpoint: Element): Promise<void> {
        this._initRenderRoot(mountpoint);

        const store = createSidebarStore(this._list);

        const epic = new SidebarEpic(this._channel, store);
        const intent = new SidebarIntent(epic, store);

        const view = (
            <StrictMode>
                <SidebarViewUpdater
                    store={store}
                    intent={intent}
                    repo={this._repo}
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

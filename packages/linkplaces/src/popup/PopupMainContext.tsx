import type { ReactViewRenderFn, TeardownFn } from '@linkplaces/foundation/view_ctx/ReactRuledViewContext';
import type { BookmarkTreeNode } from '@linkplaces/webext_types';

import { StrictMode } from 'react';

import { PopupMainViewUpdater } from './PopupMainContextView.js';
import { PopupMainEpic } from './PopupMainEpic.js';
import { PopupMainIntent } from './PopupMainIntent.js';
import { createPopupMainStore } from './PopupMainStore.js';
import type { RemoteActionChannel } from './PopupMessageChannel.js';

export async function initPopupMain(
    render: ReactViewRenderFn,
    channel: RemoteActionChannel,
    list: Array<BookmarkTreeNode>
): Promise<TeardownFn> {
    const store = createPopupMainStore(list);
    const epic = new PopupMainEpic(channel, store);
    const intent = new PopupMainIntent(epic, store);

    const view = (
        <StrictMode>
            <PopupMainViewUpdater
                store={store}
                intent={intent}
            />
        </StrictMode>
    );

    render(view);

    return () => {
        store.destory();
    };
}

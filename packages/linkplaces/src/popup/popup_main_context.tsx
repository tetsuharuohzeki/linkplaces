import type { ReactViewRenderFn, TeardownFn } from '@linkplaces/foundation/view_ctx/react';
import type { BookmarkTreeNode } from '@linkplaces/webext_types';

import { StrictMode } from 'react';

import { PopupMainViewUpdater } from './popup_main_context_view.jsx';
import { PopupMainEpic } from './popup_main_epic.js';
import { PopupMainIntent } from './popup_main_intent.js';
import { createPopupMainStore } from './popup_main_store.js';
import type { RemoteActionChannel } from './popup_message_channel.js';

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

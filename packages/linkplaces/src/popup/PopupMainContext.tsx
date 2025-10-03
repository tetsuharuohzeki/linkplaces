import { ReactRuledViewContext } from '@linkplaces/foundation/view_ctx/ReactRuledViewContext';
import { browser, type BookmarkTreeNode } from '@linkplaces/webext_types';

import { type Nullable, isNotNull, isNull } from 'option-t/nullable';
import { StrictMode, useEffect, useMemo, type ReactNode } from 'react';

import { PopupMainEpic } from './PopupMainEpic.js';
import { PopupMainIntent } from './PopupMainIntent.js';
import { createPopupMainStore, usePopupMainState, type PopupPlainReduxStore } from './PopupMainStore.js';
import { PopupMainView } from './PopupMainView.js';
import type { RemoteActionChannel } from './PopupMessageChannel.js';
import { PopupRepostiroy } from './PopupRepository.js';

export class PopupMainContext extends ReactRuledViewContext {
    private _channel: RemoteActionChannel;
    private _list: Array<BookmarkTreeNode>;
    private _disposerSet: Nullable<Set<() => void>> = null;

    constructor(channel: RemoteActionChannel, list: Array<BookmarkTreeNode>) {
        super();
        this._channel = channel;
        this._list = list;
    }

    destroy(): void {
        this._list = null as never;
        this._channel = null as never;
    }

    async onActivate(mountpoint: Element): Promise<void> {
        if (isNotNull(this._disposerSet)) {
            throw new TypeError();
        }

        this._initRenderRoot(mountpoint);

        const store = createPopupMainStore(this._list);
        const epic = new PopupMainEpic(this._channel, store);
        const intent = new PopupMainIntent(epic, store);

        this._disposerSet = new Set();

        const view = (
            <StrictMode>
                <PopupMainViewUpdater
                    store={store}
                    intent={intent}
                />
            </StrictMode>
        );

        const renderRoot = this._getRenderRoot();
        renderRoot.render(view);
    }

    async onDestroy(_mountpoint: Element): Promise<void> {
        if (isNull(this._disposerSet)) {
            throw new TypeError();
        }

        this._disposerSet.forEach((fn) => fn());
        this._disposerSet.clear();
        this._disposerSet = null;
        this._destroyRenderRoot();
    }
}

interface PopupMainViewUpdaterProps {
    store: PopupPlainReduxStore;
    intent: PopupMainIntent;
}

function PopupMainViewUpdater({ store, intent }: PopupMainViewUpdaterProps): ReactNode {
    const repository = useMemo(() => new PopupRepostiroy(browser.bookmarks, store), [store]);
    const state = usePopupMainState(store);

    useEffect(() => {
        repository.start();
        return () => {
            repository.stop();
        };
    }, [repository]);

    const view = (
        <StrictMode>
            <PopupMainView
                state={state}
                intent={intent}
            />
        </StrictMode>
    );
    return view;
}

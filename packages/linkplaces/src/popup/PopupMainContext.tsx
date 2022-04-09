import { ReactRuledViewContext } from '@linkplaces/foundation/__dist/view_ctx/ReactRuledViewContext';
import type { BookmarkTreeNode } from '@linkplaces/webext_types';

import { Nullable, isNotNull, isNull } from 'option-t/esm/Nullable/Nullable';
import { StrictMode, useSyncExternalStore } from 'react';

import { PopupMainEpic } from './PopupMainEpic';
import { PopupMainIntent } from './PopupMainIntent';
import type { PopupMainState } from './PopupMainState';
import { createPopupMainStore, type PopupPlainReduxStore } from './PopupMainStore';
import { PopupMainView } from './PopupMainView';
import type { RemoteActionChannel } from './PopupMessageChannel';
import { PopupRepostiroy } from './PopupRepository';

export class PopupMainContext extends ReactRuledViewContext {

    private _channel: RemoteActionChannel;
    private _list: Array<BookmarkTreeNode>;
    private _disposerSet: Nullable<Set<() => void>>;

    constructor(channel: RemoteActionChannel, list: Array<BookmarkTreeNode>) {
        super();
        this._channel = channel;
        this._list = list;
        this._disposerSet = null;
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

        const repository = new PopupRepostiroy(browser.bookmarks, store);

        this._disposerSet = new Set([
            () => { repository.destroy(); }
        ]);

        const view = (
            <StrictMode>
                <PopupMainViewUpdater store={store} intent={intent} />
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

function PopupMainViewUpdater({ store, intent }: PopupMainViewUpdaterProps): JSX.Element {
    const state: PopupMainState = useSyncExternalStore((onStoreChange) => {
        const disposer = store.subscribe(onStoreChange);
        return () => {
            disposer();
        };
    }, () => {
        const state = store.state();
        return state;
    });

    const view = (
        <StrictMode>
            <PopupMainView state={state} intent={intent} />
        </StrictMode>
    );
    return view;
}

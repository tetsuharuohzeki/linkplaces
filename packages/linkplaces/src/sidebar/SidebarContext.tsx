import { ReactRuledViewContext } from '@linkplaces/foundation/view_ctx/ReactRuledViewContext';
import type { BookmarkTreeNode } from '@linkplaces/webext_types';

import { type Nullable, isNotNull, expectNotNull } from 'option-t/Nullable/Nullable';
import { StrictMode, useSyncExternalStore, type ReactNode } from 'react';

import {
    Subscription,
    asyncScheduler as asyncRxScheduler,
    fromEvent as fromEventToObservable,
    subscribeOn as subscribeOnRx,
} from 'rxjs';

import type { SidebarItemViewModelEntity } from './SidebarDomain.js';
import { SidebarEpic } from './SidebarEpic.js';
import { SidebarIntent } from './SidebarIntent.js';
import type { RemoteActionChannel } from './SidebarMessageChannel.js';
import { createUpdateFromSourceAction } from './SidebarReduxAction.js';
import { SidebarRepository } from './SidebarRepository.js';
import type { SidebarState } from './SidebarState.js';
import { createSidebarStore, type SidebarPlainReduxStore } from './SidebarStore.js';
import { SidebarView } from './SidebarView.js';

export class SidebarContext extends ReactRuledViewContext {
    private _list: Array<BookmarkTreeNode>;
    private _subscription: Nullable<Subscription> = null;
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
        if (isNotNull(this._subscription)) {
            throw new TypeError();
        }
        this._initRenderRoot(mountpoint);

        const rootSubscription = new Subscription();
        const store = createSidebarStore(this._list);

        const reduxSubscription = subscribeSidebarRepositoryBySidebarStore(store, this._repo);
        rootSubscription.add(reduxSubscription);

        const epic = new SidebarEpic(this._channel, store);
        const intent = new SidebarIntent(epic, store);

        const view = (
            <StrictMode>
                <SidebarViewUpdater
                    store={store}
                    intent={intent}
                />
            </StrictMode>
        );

        const renderRoot = this._getRenderRoot();
        renderRoot.render(view);

        const pastEventObservable = fromEventToObservable(window, 'paste');

        rootSubscription.add(
            pastEventObservable.subscribe((event) => {
                if (!(event instanceof ClipboardEvent)) {
                    throw new TypeError(`this event should be paste but coming is ${event.type}`);
                }

                intent.pasteItemFromClipboardActionActual(event);
            })
        );

        activateDragAndDropTextItemHandling(rootSubscription, intent);

        this._subscription = rootSubscription;
    }

    async onDestroy(_mountpoint: Element): Promise<void> {
        const subscription = expectNotNull(this._subscription, '');
        subscription.unsubscribe();
        this._subscription = null;

        this._destroyRenderRoot();
    }
}

function activateDragAndDropTextItemHandling(rootSubscription: Subscription, intent: SidebarIntent) {
    rootSubscription.add(
        fromEventToObservable(window, 'dragover').subscribe((event) => {
            // This is required to allow to customize on drop event.
            event.preventDefault();
        })
    );

    const dropEventObservable = fromEventToObservable(window, 'drop');
    rootSubscription.add(
        dropEventObservable.subscribe((event) => {
            if (!(event instanceof DragEvent)) {
                throw new TypeError(`this event should be paste but coming is ${event.type}`);
            }

            event.preventDefault();

            intent.dropItemLikeHyperLink(event);
        })
    );
}

function subscribeSidebarRepositoryBySidebarStore(
    store: SidebarPlainReduxStore,
    repo: SidebarRepository
): Subscription {
    const subscription = repo
        .asObservable()
        .pipe(subscribeOnRx(asyncRxScheduler))
        .subscribe((source: Iterable<SidebarItemViewModelEntity>) => {
            const state: Readonly<SidebarState> = {
                list: source,
            };
            const a = createUpdateFromSourceAction(state);
            store.dispatch(a);
        });
    return subscription;
}

interface SidebarViewUpdaterProps {
    store: SidebarPlainReduxStore;
    intent: SidebarIntent;
}

function SidebarViewUpdater({ store, intent }: SidebarViewUpdaterProps): ReactNode {
    const state = useSyncExternalStore(
        (onStoreChange) => {
            const disposer = store.subscribe(onStoreChange);
            return () => {
                disposer();
            };
        },
        () => {
            const state = store.state();
            return state;
        }
    );

    const view = (
        <StrictMode>
            <SidebarView
                state={state}
                intent={intent}
            />
        </StrictMode>
    );
    return view;
}

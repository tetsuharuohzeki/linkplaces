// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="react/next" />
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="react-dom/next" />

import { Nullable, isNotNull } from 'option-t/esm/Nullable/Nullable';
import { expectNotNull } from 'option-t/esm/Nullable/expect';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';

import {
    Subscription,
    asyncScheduler as asyncRxScheduler,
    fromEvent as fromEventToObservable} from 'rxjs';
import {
    subscribeOn as subscribeOnRx,
} from 'rxjs/operators';

import type { BookmarkTreeNode } from '../../typings/webext/bookmarks';

import type { ViewContext } from '../shared/ViewContext';

import type { SidebarItemViewModelEntity } from './SidebarDomain';
import { SidebarEpic } from './SidebarEpic';
import { SidebarIntent } from './SidebarIntent';
import type { RemoteActionChannel } from './SidebarMessageChannel';
import { createUpdateFromSourceAction } from './SidebarReduxAction';
import { SidebarRepository } from './SidebarRepository';
import type { SidebarState } from './SidebarState';
import { createSidebarStateObservable, createSidebarStore } from './SidebarStore';
import { SidebarView } from './SidebarView';

export class SidebarContext implements ViewContext {

    private _list: Array<BookmarkTreeNode>;
    private _renderRoot: Nullable<ReactDOM.Root>;
    private _subscription: Nullable<Subscription>;
    private _channel: RemoteActionChannel;

    private _repo: SidebarRepository;

    constructor(list: Array<BookmarkTreeNode>, channel: RemoteActionChannel) {
        this._list = list;
        this._renderRoot = null;
        this._subscription = null;
        this._channel = channel;

        this._repo = SidebarRepository.create(browser.bookmarks, list);
    }

    async onActivate(mountpoint: Element): Promise<void> {
        if (isNotNull(this._subscription)) {
            throw new TypeError();
        }
        this._renderRoot = ReactDOM.createRoot(mountpoint);

        const subscription = new Subscription();
        const store = createSidebarStore(this._list);
        const state = createSidebarStateObservable(store);

        const reduxSubscription = this._repo.asObservable()
            .pipe(subscribeOnRx(asyncRxScheduler))
            .subscribe((source: Iterable<SidebarItemViewModelEntity>) => {
                const state: Readonly<SidebarState> = {
                    list: source,
                };
                const a = createUpdateFromSourceAction(state);
                store.dispatch(a);
            }, (e) => {
                console.exception(e);
            });

        subscription.add(reduxSubscription);

        const epic = new SidebarEpic(this._channel, store);
        const intent = new SidebarIntent(epic, store);

        const renderSubscription = state
            .subscribe((state: Readonly<SidebarState>) => {
                const view = (
                    <StrictMode>
                        <SidebarView state={state} intent={intent} />
                    </StrictMode>
                );

                const renderRoot = expectNotNull(this._renderRoot, 'should has been initialized the renderRoot');
                renderRoot.render(view);
            }, (e) => {
                console.exception(e);
            });
        subscription.add(renderSubscription);

        const pastEventObservable = fromEventToObservable(window, 'paste');

        subscription.add(pastEventObservable.subscribe((event) => {
            if (!(event instanceof ClipboardEvent)) {
                throw new TypeError(`this event should be paste but coming is ${event.type}`);
            }

            intent.pasteItemFromClipboardActionActual(event);
        }, console.error));

        this._subscription = subscription;
    }

    async onDestroy(_mountpoint: Element): Promise<void> {
        const subscription = expectNotNull(this._subscription, '');
        subscription.unsubscribe();
        this._subscription = null;

        const renderRoot = expectNotNull(this._renderRoot, '');
        renderRoot.unmount();
        this._renderRoot = null;

        this._repo.destroy();
    }

    async onResume(_mountpoint: Element): Promise<void> {
        throw new Error('Method not implemented.');
    }
    async onSuspend(_mountpoint: Element): Promise<void> {
        throw new Error('Method not implemented.');
    }
}

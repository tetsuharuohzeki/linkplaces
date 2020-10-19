// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="react-dom/experimental" />

import { Nullable, isNotNull } from 'option-t/esm/Nullable/Nullable';
import { expectNotNull } from 'option-t/esm/Nullable/expect';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';

import {
    Subscription,
    asyncScheduler as asyncRxScheduler,
    fromEvent as fromEventToObservable, Observable
} from 'rxjs';
import {
    subscribeOn as subscribeOnRx,
} from 'rxjs/operators';

import { BookmarkTreeNode } from '../../typings/webext/bookmarks';

import { ReduxLikeStore } from '../shared/ReduxLikeStore';
import { ViewContext } from '../shared/ViewContext';
import { USE_REACT_CONCURRENT_MODE } from '../shared/constants';

import { mapToSidebarItemEntity, SidebarItemViewModelEntity } from './SidebarDomain';
import { SidebarEpic } from './SidebarEpic';
import { SidebarIntent } from './SidebarIntent';
import { RemoteActionChannel } from './SidebarMessageChannel';
import { createUpdateFromSourceAction, SidebarReduxAction } from './SidebarReduxAction';
import { SidebarRepository } from './SidebarRepository';
import { reduceSidebarReduxState, SidebarState } from './SidebarState';
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

        const initialState: Readonly<SidebarState> = {
            list: this._list.map(mapToSidebarItemEntity),
        };

        const subscription = new Subscription();
        const reducer = reduceSidebarReduxState;
        const store = ReduxLikeStore.create<SidebarState, SidebarReduxAction>(reducer, initialState);

        const reduxSource = new Observable<SidebarState>((subscripber) => {
            const teerdown = store.subscribe(() => {
                const s = store.state();
                subscripber.next(s);
            });

            return () => {
                teerdown();
            };
        });
        const state: Observable<SidebarState> = reduxSource;

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

        if (USE_REACT_CONCURRENT_MODE) {
            this._renderRoot = ReactDOM.unstable_createRoot(mountpoint);
        }

        const epic = new SidebarEpic(this._channel, store);
        const intent = new SidebarIntent(epic, store);

        const renderSubscription = state
            .subscribe((state: Readonly<SidebarState>) => {
                const view = (
                    <StrictMode>
                        <SidebarView state={state} intent={intent} />
                    </StrictMode>
                );

                if (USE_REACT_CONCURRENT_MODE) {
                    const renderRoot = expectNotNull(this._renderRoot, 'should has been initialized the renderRoot');
                    renderRoot.render(view);
                } else {
                    ReactDOM.render(view, mountpoint);
                }
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

        if (USE_REACT_CONCURRENT_MODE) {
            const renderRoot = expectNotNull(this._renderRoot, '');
            renderRoot.unmount();
        } else {
            ReactDOM.unmountComponentAtNode(_mountpoint);
        }
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

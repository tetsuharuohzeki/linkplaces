// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="react-dom/experimental" />

import { Nullable, isNotNull } from 'option-t/esm/Nullable/Nullable';
import { expectNotNull } from 'option-t/esm/Nullable/expect';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';

import { applyMiddleware, createStore } from 'redux';

import {
    Subscription,
    animationFrameScheduler as animationFrameRxScheduler,
    asyncScheduler as asyncRxScheduler,
    fromEvent as fromEventToObservable, Observable
} from 'rxjs';
import {
    debounceTime,
    map as mapRx,
    subscribeOn as subscribeOnRx,
} from 'rxjs/operators';

import { BookmarkTreeNode } from '../../typings/webext/bookmarks';

import { ViewContext } from '../shared/ViewContext';
import { USE_REACT_CONCURRENT_MODE } from '../shared/constants';
import { createThunkMiddleware } from '../third_party/redux-thunk';

import { createUpdateFromSourceAction, SidebarReduxAction } from './SidebarAction';
import { mapToSidebarItemEntity, SidebarItemViewModelEntity } from './SidebarDomain';
import { SidebarViewEpic } from './SidebarEpic';
import { SidebarIntent, notifyPasteItemFromClipboardAction } from './SidebarIntent';
import { RemoteActionChannel } from './SidebarMessageChannel';
import { SidebarRepository } from './SidebarRepository';
import { createSidebarReduxReducer, createSidebarReduxStateTree, SidebarReduxStateTree, SidebarState } from './SidebarState';
import { SidebarReduxStoreEnhancer } from './SidebarStore';
import { SidebarReduxThunkArguments, SidebarReduxThunkDispatch } from './SidebarThunk';
import { SidebarView } from './SidebarView';



export class SidebarContext implements ViewContext {

    private _list: Array<BookmarkTreeNode>;
    private _renderRoot: Nullable<ReactDOM.Root>;
    private _subscription: Nullable<Subscription>;
    private _channel: RemoteActionChannel;

    private _intent: SidebarIntent;
    private _repo: SidebarRepository;
    private _epic: SidebarViewEpic;

    constructor(list: Array<BookmarkTreeNode>, channel: RemoteActionChannel) {
        this._list = list;
        this._renderRoot = null;
        this._subscription = null;
        this._channel = channel;

        const intent = new SidebarIntent();
        this._intent = intent;
        this._repo = SidebarRepository.create(browser.bookmarks, list);
        this._epic = new SidebarViewEpic(intent, this._repo, channel);
    }

    async onActivate(mountpoint: Element): Promise<void> {
        if (isNotNull(this._subscription)) {
            throw new TypeError();
        }

        this._epic.activate();

        const initialState: Readonly<SidebarState> = {
            list: this._list.map(mapToSidebarItemEntity),
        };

        const subscription = new Subscription();
        const reducer = createSidebarReduxReducer();
        const args: SidebarReduxThunkArguments = {
            channel: this._channel,
            intent: this._intent,
            repo: this._repo,
            epic: this._epic,
        };
        const middleware = createThunkMiddleware<SidebarReduxAction, SidebarReduxStateTree, SidebarReduxThunkArguments, Promise<void>>(args);
        const enhancer = applyMiddleware<SidebarReduxThunkDispatch, SidebarReduxStateTree>(middleware);
        const initial = createSidebarReduxStateTree(initialState);
        const store = createStore<SidebarReduxStateTree, SidebarReduxAction, SidebarReduxStoreEnhancer, void>(reducer, initial, enhancer);

        const reduxSource = new Observable<SidebarReduxStateTree>((subscripber) => {
            const teerdown = store.subscribe(() => {
                const s = store.getState();
                subscripber.next(s);
            });

            return () => {
                teerdown();
            };
        });
        const reduxState = reduxSource.pipe(mapRx((s: SidebarReduxStateTree) => {
            return s.classicState;
        }));
        const state: Observable<SidebarState> = reduxState;

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

        const renderSubscription = state
            .pipe(
                // XXX: Should we remove this wrapping `requestAnimationFrame()` for React concurrent mode?
                // Will React schedule requestAnimationFrame properly?
                debounceTime(0, animationFrameRxScheduler),
            ).subscribe((state: Readonly<SidebarState>) => {
                const view = (
                    <StrictMode>
                        <SidebarView state={state} intent={this._intent} />
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

            const action = notifyPasteItemFromClipboardAction(event);
            if (!action) {
                return;
            }
            this._intent.dispatch(action);
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

        this._epic.destroy();
        this._repo.destroy();
    }

    async onResume(_mountpoint: Element): Promise<void> {
        throw new Error('Method not implemented.');
    }
    async onSuspend(_mountpoint: Element): Promise<void> {
        throw new Error('Method not implemented.');
    }
}

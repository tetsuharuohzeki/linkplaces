import { Nullable, isNotNull } from 'option-t/esm/Nullable/Nullable';
import { expectNotNull } from 'option-t/esm/Nullable/expect';
import React from 'react';
import ReactDOM from 'react-dom';

import {
    debounceTime,
} from 'rxjs/operators';
import {
    Subscription,
    animationFrameScheduler as animationFrameRxScheduler,
} from 'rxjs';
import { ViewContext } from '../shared/ViewContext';

import { BookmarkTreeNode } from '../../typings/webext/bookmarks';

import { SidebarView } from './SidebarView';

import { mapToSidebarItemEntity } from './SidebarDomain';
import { SidebarViewEpic } from './SidebarEpic';
import { SidebarIntent } from './SidebarIntent';
import { SidebarState } from './SidebarState';
import { SidebarStore } from './SidebarStore';
import { SidebarRepository } from './SidebarRepository';
import { RemoteActionChannel } from './SidebarMessageChannel';

export class SidebarContext implements ViewContext {

    private _list: Array<BookmarkTreeNode>;
    private _subscription: Nullable<Subscription>;

    private _intent: SidebarIntent;
    private _repo: SidebarRepository;
    private _epic: SidebarViewEpic;
    private _store: SidebarStore;

    constructor(list: Array<BookmarkTreeNode>, channel: RemoteActionChannel) {
        this._list = list;
        this._subscription = null;

        const intent = new SidebarIntent();
        this._intent = intent;
        this._repo = SidebarRepository.create(browser.bookmarks, list);
        this._epic = new SidebarViewEpic(intent, this._repo, channel);
        this._store = new SidebarStore(intent, this._repo);
    }

    async onActivate(mountpoint: Element): Promise<void> {
        if (isNotNull(this._subscription)) {
            throw new TypeError();
        }

        this._epic.activate();
        const state = this._store.compose({
            list: this._list.map(mapToSidebarItemEntity),
        });

        this._subscription = state
            .pipe(
                debounceTime(0, animationFrameRxScheduler),
            ).subscribe((state: Readonly<SidebarState>) => {
                const view = (
                    <React.StrictMode>
                        <SidebarView state={state} intent={this._intent} />
                    </React.StrictMode>
                );
                ReactDOM.render(view, mountpoint);
            }, (e) => {
                console.exception(e);
            });
    }

    async onDestroy(mountpoint: Element): Promise<void> {
        const subscription = expectNotNull(this._subscription, '');
        subscription.unsubscribe();

        this._subscription = null;

        ReactDOM.unmountComponentAtNode(mountpoint);

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

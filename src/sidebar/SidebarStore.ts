import { Store as ReduxStore } from 'redux';
import { Observable } from 'rxjs';
import {
    map as mapRx,
    share as shareRx,
    startWith as startWithRx,
} from 'rxjs/operators';

import { Store } from '../shared/Store';

import { SidebarReduxAction } from './SidebarAction';
import { SidebarIntent } from './SidebarIntent';
import { SidebarRepository } from './SidebarRepository';
import { SidebarState } from './SidebarState';
import { SidebarReduxThunkDispatch } from './SidebarThunk';

export class SidebarStore implements Store<SidebarState> {

    private _repo: SidebarRepository;

    constructor(_intent: SidebarIntent, repo: SidebarRepository) {
        this._repo = repo;
    }

    compose(initial: Readonly<SidebarState>): Observable<SidebarState> {
        const changed: Observable<SidebarState> = this._repo.asObservable()
            .pipe(
                mapRx((list) => {
                    return { list, };
                }),
                shareRx(),
                startWithRx(initial),
            );
        return changed;
    }
}

export type SidebarReduxStoreEnhancer = {
    dispatch: SidebarReduxThunkDispatch;
};

export type SidebarReduxStore = ReduxStore<void, SidebarReduxAction> & SidebarReduxStoreEnhancer;

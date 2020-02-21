import type { Observable } from 'rxjs';
import {
    map as mapRx,
    share as shareRx,
    startWith as startWithRx,
} from 'rxjs/operators';

import type { Store } from '../shared/Store';

import type { SidebarIntent } from './SidebarIntent';
import type { SidebarRepository } from './SidebarRepository';
import type { SidebarState } from './SidebarState';

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

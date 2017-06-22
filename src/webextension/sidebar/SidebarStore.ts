import { Observable } from 'rxjs';

import { Store } from '../shared/Store';

import { SidebarIntent } from './SidebarIntent';
import { SidebarRepository } from './SidebarRepository';
import { SidebarState } from './SidebarState';

export class SidebarStore implements Store<SidebarState> {

    private _intent: SidebarIntent;
    private _repo: SidebarRepository;

    constructor(intent: SidebarIntent, repo: SidebarRepository) {
        this._intent = intent;
        this._repo = repo;
    }

    compose(initial: Readonly<SidebarState>): Observable<SidebarState> {
        return Observable.of(initial);
    }
}

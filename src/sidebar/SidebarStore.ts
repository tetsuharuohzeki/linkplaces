import { Observable, operators, } from 'rxjs';

import { Store } from '../shared/Store';

import { SidebarIntent } from './SidebarIntent';
import { SidebarRepository } from './SidebarRepository';
import { SidebarState } from './SidebarState';

const { map, merge, share } = operators;

export class SidebarStore implements Store<SidebarState> {

    private _repo: SidebarRepository;

    constructor(_intent: SidebarIntent, repo: SidebarRepository) {
        this._repo = repo;
    }

    compose(initial: Readonly<SidebarState>): Observable<SidebarState> {
        const init = Observable.of(initial);
        const changed: Observable<SidebarState> = this._repo.asObservable()
            .pipe(
                map((list) => {
                    return { list, };
                })
            );
        const result = init.pipe(
            merge(changed),
            share(),
        );

        return result;
    }
}

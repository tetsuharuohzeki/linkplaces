import { Subscription } from 'rxjs';

import { Epic } from '../shared/Epic';

import { SidebarIntent } from './SidebarIntent';
import { SidebarRepository } from './SidebarRepository';

export class SidebarViewEpic implements Epic {

    private _subscription: Subscription | null;
    private _intent: SidebarIntent;
    private _repository: SidebarRepository;

    constructor(intent: SidebarIntent, repository: SidebarRepository) {
        this._subscription = null;
        this._intent = intent;
        this._repository = repository;
    }

    activate(): void {
        if (this._subscription !== null) {
            throw new TypeError('This has been activated. You cannot activate twice in the same lifecycle.');
        }

        const s = new Subscription();
        this._subscription = s;
    }

    destroy(): void {
        const s = this._subscription;
        if (s === null) {
            return;
        }

        s.unsubscribe();
        this._subscription = null;
    }
}

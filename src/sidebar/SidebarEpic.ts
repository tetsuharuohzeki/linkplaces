import { Nullable } from 'option-t/es6/Nullable';
import { Subscription } from 'rxjs';

import { Channel } from '../shared/Channel';
import { Epic } from '../shared/Epic';
import { openItem } from '../shared/RemoteCall';

import { SidebarIntent } from './SidebarIntent';
import { SidebarRepository } from './SidebarRepository';

export class SidebarViewEpic implements Epic {

    private _subscription: Nullable<Subscription>;
    private _intent: SidebarIntent;
    private _repository: SidebarRepository;
    private _channel: Channel;

    constructor(intent: SidebarIntent, repository: SidebarRepository, channel: Channel) {
        this._subscription = null;
        this._intent = intent;
        this._repository = repository;
        this._channel = channel;
    }

    activate(): void {
        if (this._subscription !== null) {
            throw new TypeError('This has been activated. You cannot activate twice in the same lifecycle.');
        }

        const s = new Subscription();
        this._subscription = s;

        s.add( this._intent.openItem().subscribe(({ id, url,}) => {
            openItem(this._channel, id, url);
        }, console.error) );
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

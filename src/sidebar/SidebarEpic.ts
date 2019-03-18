import { Nullable, isNotNull } from 'option-t/esm/Nullable/Nullable';
import { expectNotNull } from 'option-t/esm/Nullable/expect';
import { Subscription } from 'rxjs';

import { Epic } from '../shared/Epic';
import { openItem } from '../shared/RemoteCall';

import { SidebarIntent } from './SidebarIntent';
import { SidebarRepository } from './SidebarRepository';
import { RemoteActionChannel } from './SidebarMessageChannel';

export class SidebarViewEpic implements Epic {

    private _subscription: Nullable<Subscription>;
    private _intent: SidebarIntent;
    private _channel: RemoteActionChannel;
    private _repository: SidebarRepository;

    constructor(intent: SidebarIntent, repository: SidebarRepository, channel: RemoteActionChannel) {
        this._subscription = null;
        this._intent = intent;
        this._channel = channel;
        this._repository = repository;
    }

    activate(): void {
        if (isNotNull(this._subscription)) {
            throw new TypeError('This has been activated. You cannot activate twice in the same lifecycle.');
        }

        const s = new Subscription();
        this._subscription = s;

        s.add(this._intent.openItem().subscribe(({ id, url, where, }) => {
            this._repository.setIsOpening(id);
            openItem(this._channel, id, url, where);
        }, console.error));
    }

    destroy(): void {
        const s = expectNotNull(this._subscription, 'This has been destroyed');
        s.unsubscribe();
        this._subscription = null;
        this._intent = null as any; // eslint-disable-line @typescript-eslint/no-explicit-any
        this._channel = null as any; // eslint-disable-line @typescript-eslint/no-explicit-any
        this._repository = null as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    }
}

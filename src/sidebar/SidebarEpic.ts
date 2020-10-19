import { Nullable, isNotNull } from 'option-t/esm/Nullable/Nullable';
import { expectNotNull } from 'option-t/esm/Nullable/expect';
import { Subscription } from 'rxjs';

import { Epic } from '../shared/Epic';

import { SidebarIntent } from './SidebarIntent';
import { RemoteActionChannel } from './SidebarMessageChannel';
import { SidebarRepository } from './SidebarRepository';

export class SidebarViewEpic implements Epic {

    private _subscription: Nullable<Subscription>;

    constructor(_intent: SidebarIntent, _repository: SidebarRepository, _channel: RemoteActionChannel) {
        this._subscription = null;
    }

    activate(): void {
        if (isNotNull(this._subscription)) {
            throw new TypeError('This has been activated. You cannot activate twice in the same lifecycle.');
        }

        const s = new Subscription();
        this._subscription = s;
    }

    destroy(): void {
        const s = expectNotNull(this._subscription, 'This has been destroyed');
        s.unsubscribe();
        this._subscription = null;
    }
}

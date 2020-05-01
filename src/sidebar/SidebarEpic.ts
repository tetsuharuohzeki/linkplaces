import { Nullable, isNotNull } from 'option-t/esm/Nullable/Nullable';
import { expectNotNull } from 'option-t/esm/Nullable/expect';
import { Subscription } from 'rxjs';

import { Epic } from '../shared/Epic';
import { openItem, registerItem } from '../shared/RemoteCall';

import { SidebarIntent } from './SidebarIntent';
import { RemoteActionChannel } from './SidebarMessageChannel';
import { SidebarRepository } from './SidebarRepository';

export class SidebarViewEpic implements Epic {

    private _subscription: Nullable<Subscription>;
    private _intent: SidebarIntent;
    private _channel: RemoteActionChannel;

    constructor(intent: SidebarIntent, _repository: SidebarRepository, channel: RemoteActionChannel) {
        this._subscription = null;
        this._intent = intent;
        this._channel = channel;
    }

    activate(): void {
        if (isNotNull(this._subscription)) {
            throw new TypeError('This has been activated. You cannot activate twice in the same lifecycle.');
        }

        const s = new Subscription();
        this._subscription = s;

        s.add(this._intent.openItem().subscribe(({ id, url, where, }) => {
            openItem(this._channel, id, url, where);
        }, console.error));

        s.add(this._intent.pasteUrlFromClipboard().subscribe(({ data }) => {
            const d = data.getData('text/plain');
            registerItem(this._channel, d);
        }, console.error));

        s.add(this._intent.copyUrlToClipboard().subscribe(({ url }) => {
            navigator.clipboard.writeText(url).catch(console.error);
        }, console.error));
    }

    destroy(): void {
        const s = expectNotNull(this._subscription, 'This has been destroyed');
        s.unsubscribe();
        this._subscription = null;
        this._intent = null as any; // eslint-disable-line @typescript-eslint/no-explicit-any
        this._channel = null as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    }
}

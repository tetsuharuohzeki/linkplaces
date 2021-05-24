import type { Nullable } from 'option-t/esm/Nullable/Nullable';
import { unwrapNullable } from 'option-t/esm/Nullable/unwrap';
import type { Packet } from '../shared/Channel';
import type { RemoteAction } from '../shared/RemoteAction';

import { BackgroundRemoteActionReciever } from './BackgroundRemoteActionReciever';
import { createContextMenu } from './ContextMenu';

let service: Nullable<BackgroundRemoteActionReciever> = null;

(function main() {
    createContextMenu();

    service = new BackgroundRemoteActionReciever();

    browser.runtime.onConnect.addListener((s) => {
        s.onMessage.addListener(onMessageFromPopup);
        s.onDisconnect.addListener(function onDisconnect() {
            s.onDisconnect.removeListener(onDisconnect);
            s.onMessage.removeListener(onMessageFromPopup);
        });
    });
})();

function onMessageFromPopup(packet: Packet<RemoteAction>): void {
    const { payload: msg } = packet;
    handleRemoteAction(msg).catch(console.error);
}

async function handleRemoteAction(msg: RemoteAction): Promise<void> {
    const svc = unwrapNullable(service);
    await svc.call(msg);
}

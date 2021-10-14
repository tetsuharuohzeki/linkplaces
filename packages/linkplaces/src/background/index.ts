import { Ipc } from '@linkplaces/foundation';
import { assertIsRemoteAction } from '../shared/RemoteAction';

import { BackgroundRemoteActionReciever } from './BackgroundRemoteActionReciever';
import { createContextMenu } from './ContextMenu';
declare global {
    // We keep this for debugging.
    // eslint-disable-next-line no-var
    var livingConnectionSet: WeakSet<Ipc.ServerConnection<unknown, unknown>>;
}

(function main() {
    createContextMenu();

    globalThis.livingConnectionSet = new WeakSet();

    browser.runtime.onConnect.addListener((portToSender) => {
        const service = new BackgroundRemoteActionReciever();
        const wrapper = new Ipc.OneShotResponder(assertIsRemoteAction, service);
        const server = new Ipc.ServerConnection(portToSender, wrapper);

        globalThis.livingConnectionSet.add(server);

        server.run();
    });
})();

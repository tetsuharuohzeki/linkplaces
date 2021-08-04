import { OneShotResponder, ServerConnection } from '../foundation/tower_like_ipc/ServerConnection';
import { assertIsRemoteAction } from '../shared/RemoteAction';

import { BackgroundRemoteActionReciever } from './BackgroundRemoteActionReciever';
import { createContextMenu } from './ContextMenu';
declare global {
    // We keep this for debugging.
    // eslint-disable-next-line no-var
    var livingConnectionSet: WeakSet<ServerConnection<unknown, unknown>>;
}

(function main() {
    createContextMenu();

    globalThis.livingConnectionSet = new WeakSet();

    browser.runtime.onConnect.addListener((portToSender) => {
        const service = new BackgroundRemoteActionReciever();
        const wrapper = new OneShotResponder(service, assertIsRemoteAction);
        const server = new ServerConnection(portToSender, wrapper);

        globalThis.livingConnectionSet.add(server);

        server.run();
    });
})();



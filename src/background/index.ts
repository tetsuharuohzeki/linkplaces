import { OneShotResponder, ServerConnection } from '../shared/ServerConnection';

import { BackgroundRemoteActionReciever } from './BackgroundRemoteActionReciever';
import { createContextMenu } from './ContextMenu';
declare global {
    // We keep this for debugging.
    var livingConnectionSet: WeakSet<ServerConnection<unknown>>;
}

(function main() {
    createContextMenu();

    globalThis.livingConnectionSet = new WeakSet();

    browser.runtime.onConnect.addListener((portToSender) => {
        const service = new BackgroundRemoteActionReciever();
        const wrapper = new OneShotResponder(service);
        const server = new ServerConnection(portToSender, wrapper);

        globalThis.livingConnectionSet.add(server);

        server.run();
    });
})();

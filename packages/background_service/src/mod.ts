import { OneShotResponder, MessageServer } from '@linkplaces/foundation/tower_like_ipc';
import { assertIsRemoteAction } from '@linkplaces/ipc_message';

import { BackgroundRemoteActionReciever } from './BackgroundRemoteActionReciever.js';
import { createContextMenu } from './ContextMenu.js';

declare global {
    // We keep this for debugging.
    // eslint-disable-next-line no-var
    var livingConnectionSet: WeakSet<MessageServer>;
}

(function main() {
    const runtime = browser.runtime;
    runtime.onInstalled.addListener(function onInstalled() {
        runtime.onInstalled.removeListener(onInstalled);
        createContextMenu();
    });

    globalThis.livingConnectionSet = new WeakSet();

    const service = new BackgroundRemoteActionReciever();
    const wrapper = new OneShotResponder(assertIsRemoteAction, service);
    const server = new MessageServer(runtime, wrapper);
    server.run();

    globalThis.livingConnectionSet.add(server);

    runtime.onSuspend.addListener(function onSuspend() {
        server.destory();
        wrapper.destroy();
    });
})();

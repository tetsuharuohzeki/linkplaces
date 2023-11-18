import { SendMessageResponder } from '@linkplaces/foundation/tower_like_ipc';
import { assertIsRemoteAction, type RemoteAction } from '@linkplaces/ipc_message';

import { BackgroundRemoteActionReciever } from './BackgroundRemoteActionReciever.js';
import { setupContextMenus } from './ContextMenu.js';

declare global {
    // We keep this for debugging.
    // eslint-disable-next-line no-var
    var livingConnectionSet: WeakSet<SendMessageResponder<RemoteAction, void>>;
}

(function main() {
    setupContextMenus(browser);

    const runtime = browser.runtime;
    globalThis.livingConnectionSet = new WeakSet();

    const service = new BackgroundRemoteActionReciever();
    const server = new SendMessageResponder(runtime, assertIsRemoteAction, service);
    server.run();

    globalThis.livingConnectionSet.add(server);

    runtime.onSuspend.addListener(function onSuspend() {
        server.destory();
    });
})();

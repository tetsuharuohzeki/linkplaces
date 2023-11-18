import { SendMessageResponder } from '@linkplaces/foundation/tower_like_ipc';
import { assertIsRemoteAction } from '@linkplaces/ipc_message';

import { BackgroundRemoteActionReciever } from './BackgroundRemoteActionReciever.js';
import { setupContextMenus } from './ContextMenu.js';

(function main() {
    setupContextMenus(browser);

    const runtime = browser.runtime;

    runtime.onMessage.addListener(async function onMessage(message, sender) {
        const service = new BackgroundRemoteActionReciever();
        const server = new SendMessageResponder(assertIsRemoteAction, service);
        const res = await server.onMessage(message, sender);
        return res;
    });
})();

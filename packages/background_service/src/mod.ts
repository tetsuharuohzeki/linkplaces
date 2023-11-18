import { callResponderServiceWithMessage } from '@linkplaces/foundation/tower_like_ipc';
import { assertIsRemoteAction } from '@linkplaces/ipc_message';

import { callBackgroundRemoteActionReciever } from './BackgroundRemoteActionReciever.js';
import { setupContextMenus } from './ContextMenu.js';

(function main() {
    setupContextMenus(browser);

    const runtime = browser.runtime;

    runtime.onMessage.addListener(async function onMessage(message, sender) {
        const res = await callResponderServiceWithMessage(
            callBackgroundRemoteActionReciever,
            assertIsRemoteAction,
            message,
            sender
        );
        return res;
    });
})();

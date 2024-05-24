import { callResponderServiceWithMessage } from '@linkplaces/foundation/tower_like_ipc';
import { assertIsRemoteAction } from '@linkplaces/ipc_message';

import { CompileTimeEmbeddedConstants } from '@linkplaces/shared';
import { callBackgroundRemoteActionReciever } from './BackgroundRemoteActionReciever.js';
import { appendContextMenu, onClickContextMenu } from './ContextMenu.js';

(function main() {
    const runtime = browser.runtime;
    const menus = browser.menus;

    if (CompileTimeEmbeddedConstants.ENABLE_MV3) {
        runtime.onInstalled.addListener(() => {
            appendContextMenu(browser);
        });
    } else {
        appendContextMenu(browser);
    }

    menus.onClicked.addListener(onClickContextMenu);

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

import { callResponderServiceWithMessage } from '@linkplaces/foundation/tower_like_ipc';
import { assertIsRemoteAction } from '@linkplaces/ipc_message';

import { browser } from '@linkplaces/webext_types';
import { callBackgroundRemoteActionReciever } from './background_remote_action_reciever.js';
import { appendContextMenu, onClickContextMenu } from './context_menu.js';

(function main() {
    const runtime = browser.runtime;
    const menus = browser.menus;

    runtime.onInstalled.addListener(() => {
        appendContextMenu(browser);
    });

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

import { callResponderServiceWithMessage } from '@linkplaces/foundation/tower_like_ipc';
import { assertIsRemoteAction } from '@linkplaces/ipc_message';

import { browser, type ExtensionMessageSender } from '@linkplaces/webext_types';
import { callBackgroundRemoteActionReciever } from './background_remote_action_reciever.js';
import { checkSenderOrigin } from './check_sender_origin.js';
import { appendContextMenu, onClickContextMenu } from './context_menu.js';

export async function callBackgroundServiceAsInProcessReceiver(
    message: object,
    sender: ExtensionMessageSender
): Promise<unknown> {
    checkSenderOrigin(sender, browser.runtime);

    const res = await callResponderServiceWithMessage(
        callBackgroundRemoteActionReciever,
        assertIsRemoteAction,
        message
    );
    return res;
}

export function initializeBackgroundService(): void {
    const runtime = browser.runtime;
    const menus = browser.menus;

    runtime.onInstalled.addListener(() => {
        appendContextMenu(browser);
    });

    menus.onClicked.addListener(onClickContextMenu);

    runtime.onMessage.addListener(callBackgroundServiceAsInProcessReceiver);
}

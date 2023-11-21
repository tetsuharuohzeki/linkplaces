import { callResponderServiceWithMessage } from '@linkplaces/foundation/tower_like_ipc';
import { assertIsRemoteAction } from '@linkplaces/ipc_message';

import { callBackgroundRemoteActionReciever } from './BackgroundRemoteActionReciever.js';
import { appendContextMenu, onClickContextMenu } from './ContextMenu.js';

(function main() {
    const runtime = browser.runtime;
    const menus = browser.menus;

    // [By the backgroun page doc on MDN](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Background_scripts),
    // an extension should use `browser.runtime.onInstalled` to register a menu
    // But this code only works once after user install extension
    // on [Firefox 106.0a1](https://hg.mozilla.org/mozilla-central/rev/c731914e80964349114e473544e7a7165cae3cc1)
    // So we need place this intializer in the top level scope even if the background page is non-persistent.
    appendContextMenu(browser);
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

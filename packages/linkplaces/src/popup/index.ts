import { setupTeardownOnPageHide } from '@linkplaces/foundation/view_ctx';
import { renderReactView } from '@linkplaces/foundation/view_ctx/react';
import { getUnfiledBoolmarkFolder } from '@linkplaces/shared/bookmark';

import { browser } from '@linkplaces/webext_types';
import { registerComponents } from './component/register.js';
import { initPopupMain } from './popup_main_context.jsx';
import { createChannel } from './popup_message_channel.js';

(async function main() {
    registerComponents();

    const [list, channel] = await Promise.all([getUnfiledBoolmarkFolder(), createChannel(browser.runtime)]);

    window.addEventListener('contextmenu', disableCtxMenu);

    const viewTeardown = await renderReactView(async (render) => {
        const teardown = initPopupMain(render, channel, list);
        return teardown;
    });

    setupTeardownOnPageHide(window, (_event) => {
        viewTeardown();
        window.removeEventListener('contextmenu', disableCtxMenu);
        channel.destroy();
    });
})().catch(console.error);

function disableCtxMenu(event: MouseEvent) {
    if (event.shiftKey) {
        // allow to open debugger if the shiftkey is down.
        return;
    }

    event.preventDefault();
}

import { setupTeardownOnPageHide } from '@linkplaces/foundation/view_ctx';
import { renderReactView } from '@linkplaces/foundation/view_ctx/react';
import { getUnfiledBoolmarkFolder } from '@linkplaces/shared/bookmark';

import { browser } from '@linkplaces/webext_types';
import { initSidebarContext } from './sidebar_context.jsx';
import { createChannel } from './sidebar_message_channel.js';

(async function main() {
    const [list, channel] = await Promise.all([
        getUnfiledBoolmarkFolder(browser.bookmarks),
        createChannel(browser.runtime),
    ]);

    window.addEventListener('contextmenu', disableCtxMenu);

    const viewTeardown = await renderReactView((render) => {
        return initSidebarContext(render, channel, list);
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

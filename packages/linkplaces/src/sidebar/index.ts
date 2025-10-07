import { renderReactView } from '@linkplaces/foundation/view_ctx/react';
import { getUnfiledBoolmarkFolder } from '@linkplaces/shared/bookmark';

import { browser } from '@linkplaces/webext_types';
import { initSidebarContext } from './sidebar_context.jsx';
import { createChannel } from './sidebar_message_channel.js';

(async function main() {
    const [list, channel] = await Promise.all([getUnfiledBoolmarkFolder(), createChannel(browser.runtime)]);

    window.addEventListener('contextmenu', disableCtxMenu);

    window.addEventListener(
        'pagehide',
        function onClose(_event) {
            window.removeEventListener('contextmenu', disableCtxMenu);
            channel.destroy();
        },
        {
            once: true,
        }
    );

    await renderReactView((render) => {
        return initSidebarContext(render, channel, list);
    });
})().catch(console.error);

function disableCtxMenu(event: MouseEvent) {
    if (event.shiftKey) {
        // allow to open debugger if the shiftkey is down.
        return;
    }

    event.preventDefault();
}

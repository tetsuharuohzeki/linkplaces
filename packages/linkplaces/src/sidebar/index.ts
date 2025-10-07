import { landViewContext } from '@linkplaces/foundation/view_ctx';
import { getUnfiledBoolmarkFolder } from '@linkplaces/shared/bookmark';

import { browser } from '@linkplaces/webext_types';
import { SidebarContext } from './sidebar_context.jsx';
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

    const ctx = new SidebarContext(list, channel);
    await landViewContext(ctx);
})().catch(console.error);

function disableCtxMenu(event: MouseEvent) {
    if (event.shiftKey) {
        // allow to open debugger if the shiftkey is down.
        return;
    }

    event.preventDefault();
}

import { renderReactView } from '@linkplaces/foundation/view_ctx/react';
import { getUnfiledBoolmarkFolder } from '@linkplaces/shared/bookmark';

import { browser } from '@linkplaces/webext_types';
import { registerComponents } from './component/register.js';
import { initPopupMain } from './popup_main_context.js';
import { createChannel } from './popup_message_channel.js';

(async function main() {
    registerComponents();

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

    await renderReactView(async (render) => {
        const teardown = initPopupMain(render, channel, list);
        return teardown;
    });
})().catch(console.error);

function disableCtxMenu(event: MouseEvent) {
    if (event.shiftKey) {
        // allow to open debugger if the shiftkey is down.
        return;
    }

    event.preventDefault();
}

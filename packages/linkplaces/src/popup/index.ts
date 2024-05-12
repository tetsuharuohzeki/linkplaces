import { landViewContext } from '@linkplaces/foundation/view_ctx';
import { getUnfiledBoolmarkFolder } from '@linkplaces/shared/bookmark';

import { PopupMainContext } from './PopupMainContext.js';
import { createChannel } from './PopupMessageChannel.js';
import { registerComponents } from './component/register.js';

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

    const ctx = new PopupMainContext(channel, list);
    await landViewContext(ctx);
})().catch(console.error);

function disableCtxMenu(event: MouseEvent) {
    if (event.shiftKey) {
        // allow to open debugger if the shiftkey is down.
        return;
    }

    event.preventDefault();
}

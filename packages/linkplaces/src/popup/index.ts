import { landViewContext } from '@linkplaces/foundation';
import { getUnfiledBoolmarkFolder } from '../shared/Bookmark';


import { PopupMainContext } from './PopupMainContext';
import { createChannel } from './PopupMessageChannel';
import { registerComponents } from './component/register';

(async function main() {
    registerComponents();

    const [list, channel] = await Promise.all([
        getUnfiledBoolmarkFolder(),
        createChannel(),
    ]);

    window.addEventListener('contextmenu', disableCtxMenu);

    window.addEventListener('pagehide', function onClose(_event) {
        window.removeEventListener('contextmenu', disableCtxMenu);
        channel.destroy();
    }, {
        once: true,
    });

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

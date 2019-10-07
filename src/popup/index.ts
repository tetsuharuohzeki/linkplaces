import { getUnfiledBoolmarkFolder } from '../shared/Bookmark';
import { landViewContext } from '../shared/LandingPad';

import { registerComponents } from './component/register';

import { PopupMainContext } from './PopupMainContext';
import { createChannel } from './PopupMessageChannel';

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

function disableCtxMenu(event: Event) {
    event.preventDefault();
}

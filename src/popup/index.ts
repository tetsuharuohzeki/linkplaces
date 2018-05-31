import { isNull } from 'option-t/esm/Nullable/Nullable';

import { getUnfiledBoolmarkFolder } from '../shared/Bookmark';
import { USE_WEB_COMPONENT } from '../shared/constants';

import { registerComponents } from './component/register';

import { PopupMainContext } from './PopupMainContext';
import { createChannel } from './PopupMessageChannel';

(async function main(){
    if (USE_WEB_COMPONENT) {
        registerComponents();
    }

    const [list, channel] = await Promise.all([
        getUnfiledBoolmarkFolder(),
        createChannel(),
    ]);

    window.addEventListener('contextmenu', disableCtxMenu);

    window.addEventListener('unload', function onClose(_event) {
        window.removeEventListener('contextmenu', disableCtxMenu);
        channel.destroy();
    }, {
        once: true,
    });

    const mountpoint = document.getElementById('js-mountpoint');
    if (isNull(mountpoint)) {
        throw new TypeError('not found mountpoint');
    }

    const ctx = new PopupMainContext(channel, list);
    ctx.onActivate(mountpoint);
})().catch(console.error);

function disableCtxMenu(event: Event) {
    event.preventDefault();
}

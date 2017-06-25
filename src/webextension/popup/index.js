/* eslint-env browser, webextensions */

import { getUnfiledBoolmarkFolder } from '../shared/Bookmark';
import { PopupMainContext } from './PopupMainContext';
import { createChannel } from './PopupMessageChannel';

(async function main(){
    const list = await getUnfiledBoolmarkFolder();

    const channel = await createChannel();
    window.addEventListener('unload', function onClose(event) {
        window.removeEventListener(event.type, onClose);
        channel.destroy();
    });

    const mountpoint = document.getElementById('js-mountpoint');
    const ctx = new PopupMainContext(channel, list);
    ctx.onActivate(mountpoint);
})().catch(console.error);

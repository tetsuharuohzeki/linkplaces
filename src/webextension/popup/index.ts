import { getUnfiledBoolmarkFolder } from '../shared/Bookmark';
import { PopupMainContext } from './PopupMainContext';
import { createChannel } from './PopupMessageChannel';

(async function main(){
    const [list, channel] = await Promise.all([
        getUnfiledBoolmarkFolder(),
        createChannel(),
    ]);

    window.addEventListener('unload', function onClose(event) {
        window.removeEventListener(event.type, onClose);
        channel.destroy();
    });

    const mountpoint = document.getElementById('js-mountpoint');
    if (mountpoint === null) {
        throw new TypeError('not found mountpoint');
    }

    const ctx = new PopupMainContext(channel, list);
    ctx.onActivate(mountpoint);
})().catch(console.error);

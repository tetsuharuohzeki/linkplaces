import { isNull } from 'option-t/esm/Nullable/Nullable';
import { getUnfiledBoolmarkFolder } from '../shared/Bookmark';
import { SidebarContext } from './SidebarContext';
import { createChannel } from './SidebarMessageChannel';

(async function main(){
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

    const ctx = new SidebarContext(list, channel);
    ctx.onActivate(mountpoint);
})().catch(console.error);

function disableCtxMenu(event: Event) {
    event.preventDefault();
}

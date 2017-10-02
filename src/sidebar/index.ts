import { getUnfiledBoolmarkFolder } from '../shared/Bookmark';
import { SidebarContext } from './SidebarContext';
import { createChannel } from './SidebarMessageChannel';

(async function main(){
    const [list, channel] = await Promise.all([
        getUnfiledBoolmarkFolder(),
        createChannel(),
    ]);

    window.addEventListener('contextmenu', disableCtxMenu);

    window.addEventListener('unload', function onClose(event) {
        window.removeEventListener(event.type, onClose);
        window.removeEventListener('contextmenu', disableCtxMenu);
        channel.destroy();
    });

    const mountpoint = document.getElementById('js-mountpoint');
    if (mountpoint === null) {
        throw new TypeError('not found mountpoint');
    }

    const ctx = new SidebarContext(list, channel);
    ctx.onActivate(mountpoint);
})().catch(console.error);

function disableCtxMenu(event: MouseEvent) {
    event.preventDefault();
}

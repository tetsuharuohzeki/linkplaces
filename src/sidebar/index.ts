import { getUnfiledBoolmarkFolder } from '../shared/Bookmark';
import { landViewContext } from '../shared/LandingPad';
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

    const ctx = new SidebarContext(list, channel);
    await landViewContext(ctx);
})().catch(console.error);

function disableCtxMenu(event: Event) {
    event.preventDefault();
}

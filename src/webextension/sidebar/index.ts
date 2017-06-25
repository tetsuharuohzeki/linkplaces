import { getUnfiledBoolmarkFolder } from '../shared/Bookmark';
import { SidebarContext } from './SidebarContext';

(async function main(){
    const list = await getUnfiledBoolmarkFolder();

    const mountpoint = document.getElementById('js-mountpoint');
    if (mountpoint === null) {
        throw new TypeError('not found mountpoint');
    }

    const ctx = new SidebarContext(list);
    ctx.onActivate(mountpoint);
})().catch(console.error);

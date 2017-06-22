/* eslint-env browser */
import { getUnfiledBoolmarkFolder } from '../shared/Bookmark';
import { SidebarContext } from './SidebarContext';

(async function main(){
    const list = await getUnfiledBoolmarkFolder();

    const mountpoint = document.getElementById('js-mountpoint');
    const ctx = new SidebarContext(list);
    ctx.onActivate(mountpoint);
})().then(console.log, console.error);

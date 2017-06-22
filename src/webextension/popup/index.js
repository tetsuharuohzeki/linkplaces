/* eslint-env browser, webextensions */

import { getUnfiledBoolmarkFolder } from '../shared/Bookmark';
import { PopupMainContext } from './PopupMainContext';

(async function main(){
    const list = await getUnfiledBoolmarkFolder();
    console.dir(list);

    const mountpoint = document.getElementById('js-mountpoint');
    const ctx = new PopupMainContext(list);
    ctx.onActivate(mountpoint);
})().then(console.log, console.error);

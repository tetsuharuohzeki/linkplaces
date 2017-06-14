/* eslint-env browser, webextensions */

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { getUnfiledBoolmarkFolder } from './Bookmark';
import { BookmarkPanel } from './view/ListView';

import { PopupMainContext } from './PopupMainContext';

(async function main(){
    const list = await getUnfiledBoolmarkFolder();
    console.dir(list);

    const v = React.createElement(BookmarkPanel, {
        list,
    });
    const mountpoint = document.getElementById('js-mountpoint');
    ReactDOM.render(v, mountpoint, () => {
        console.log('complete');
    });

    const ctx = new PopupMainContext(list);
    ctx.onActivate(mountpoint);
})().then(console.log, console.error);

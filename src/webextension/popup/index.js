/* eslint-env browser, webextensions */

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { BookmarkPanel } from './view/ListView';

function getUnfiledBoolmarkFolder() {
    // This code only works with Firefox.
    return browser.bookmarks.getChildren('unfiled_____');
}

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
})().then(console.log, console.error);

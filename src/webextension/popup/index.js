/* eslint-env browser, webextensions */

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Panel } from './view/ListView';

function getUnfiledBoolmarkFolder() {
    // This code only works with Firefox.
    return browser.bookmarks.getChildren('unfiled_____');
}

(async function main(){
    const items = await getUnfiledBoolmarkFolder();
    console.dir(items);

    const list = items.map((item) => { // eslint-disable-line
        return {
            item: '',
            text: item.title,
            shortcut: '',
        };
    });

    const v = React.createElement(Panel, {
        list,
    });
    const mountpoint = document.getElementById('js-mountpoint');
    ReactDOM.render(v, mountpoint, () => {
        console.log('complete');
    });
})().then(console.log, console.error);

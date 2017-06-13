/* eslint-env browser, webextensions */

import * as ReactDOM from 'react-dom';

import { Panel } from './view/list';

function getUnfiledBoolmarkFolder() {
    // This code only works with Firefox.
    return browser.bookmarks.getChildren('unfiled_____');
}

(async function main(){
    const list = await getUnfiledBoolmarkFolder();
    console.dir(list);

    const items = list.map((item) => {
        return {
            item: '',
            text: item.title,
            shortcut: '',
        };
    });

    const mountpoint = document.getElementById('js-mountpoint');
    const v = <Panel list={items}/>;
    ReactDOM.render(v, mountpoint, () => {
        console.log('complete');
    });
})().then(console.log, console.error);

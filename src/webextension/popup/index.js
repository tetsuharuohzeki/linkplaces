/* eslint-env browser, webextensions */

import {
    createPanel,
    createListItem,
} from './view/list';

function getUnfiledBoolmarkFolder() {
    // This code only works with Firefox.
    return browser.bookmarks.getChildren('unfiled_____');
}

(async function main(){
    const list = await getUnfiledBoolmarkFolder();
    console.dir(list);

    const bag = document.createDocumentFragment();
    for (const item of list) {
        const i = createListItem({
            icon: '',
            text: item.title,
            shortcut: '',
        });
        bag.appendChild(i);
    }

    createPanel(bag);
})().then(console.log, console.error);

import React from 'react';
import ReactDOM from 'react-dom';

import { OptionsView } from './OptionsView';

function getUrl(path: string): { url: string; title: string; } {
    const url = browser.extension.getURL(path);
    return {
        url,
        title: path,
    };
}

(async function main(){
    const optionview = React.createElement(OptionsView, {
        list: [
            getUrl('popup/index.html'),
            getUrl('sidebar/index.html'),
        ],
    });
    const mountpoint = document.getElementById('js-mountpoint');

    const view = React.createElement(React.StrictMode, null, optionview);
    ReactDOM.render(view, mountpoint);
})().catch(console.error);

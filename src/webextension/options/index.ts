import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { OptionsView } from './OptionsView';

(async function main(){
    const view = React.createElement(OptionsView, {}, []);
    const mountpoint = document.getElementById('js-mountpoint');
    ReactDOM.render(view, mountpoint);
})().catch(console.error);

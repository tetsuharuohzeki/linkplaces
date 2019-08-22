import React from 'react';
import ReactDOM from 'react-dom';

import { ViewContext } from '../shared/ViewContext';
import { OptionsView } from './OptionsView';

function getUrl(path: string): { url: string; title: string; } {
    const url = browser.extension.getURL(path);
    return {
        url,
        title: path,
    };
}

export class OptionsContext implements ViewContext {
    async onActivate(mountpoint: Element): Promise<void> {
        const list = [
            getUrl('popup/index.html'),
            getUrl('sidebar/index.html'),
        ];

        const view = (
            <React.StrictMode>
                <OptionsView list={list} />
            </React.StrictMode>
        );
        ReactDOM.render(view, mountpoint);
    }

    async onDestroy(mountpoint: Element): Promise<void> {
        ReactDOM.unmountComponentAtNode(mountpoint);
    }

    async onResume(_mountpoint: Element): Promise<void> {
        throw new Error('Method not implemented.');
    }
    async onSuspend(_mountpoint: Element): Promise<void> {
        throw new Error('Method not implemented.');
    }
}

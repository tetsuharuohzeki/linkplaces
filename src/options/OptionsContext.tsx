import React from 'react';
import ReactDOM from 'react-dom';

import { SyncViewContext } from '../shared/ViewContext';
import { OptionsView } from './OptionsView';

function getUrl(path: string): { url: string; title: string; } {
    const url = browser.extension.getURL(path);
    return {
        url,
        title: path,
    };
}

export class OptionsContext implements SyncViewContext {
    onActivate(mountpoint: Element): void {
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

    onDestroy(mountpoint: Element): void {
        ReactDOM.unmountComponentAtNode(mountpoint);
    }

    onResume(_mountpoint: Element): void {
        throw new Error('Method not implemented.');
    }
    onSuspend(_mountpoint: Element): void {
        throw new Error('Method not implemented.');
    }
}

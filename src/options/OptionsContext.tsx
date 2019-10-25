// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="react-dom/experimental" />

import { Nullable } from 'option-t/esm/Nullable/Nullable';
import { expectNotNull } from 'option-t/esm/Nullable/expect';
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
    private _renderRoot: Nullable<ReactDOM.Root>;

    constructor() {
        this._renderRoot = null;
    }

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
        const renderRoot = ReactDOM.createBlockingRoot(mountpoint);
        this._renderRoot = renderRoot;
        renderRoot.render(view);
    }

    async onDestroy(_mountpoint: Element): Promise<void> {
        const renderRoot = expectNotNull(this._renderRoot, '');
        renderRoot.unmount();
        this._renderRoot = null;
    }

    async onResume(_mountpoint: Element): Promise<void> {
        throw new Error('Method not implemented.');
    }
    async onSuspend(_mountpoint: Element): Promise<void> {
        throw new Error('Method not implemented.');
    }
}

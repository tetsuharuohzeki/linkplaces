// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="react-dom/experimental" />

import { Nullable } from 'option-t/esm/Nullable/Nullable';
import { expectNotNull } from 'option-t/esm/Nullable/expect';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';

import { ViewContext } from '../shared/ViewContext';
import { USE_REACT_CONCURRENT_MODE } from '../shared/constants';
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
            <StrictMode>
                <OptionsView list={list} />
            </StrictMode>
        );

        if (USE_REACT_CONCURRENT_MODE) {
            const renderRoot = ReactDOM.unstable_createRoot(mountpoint);
            this._renderRoot = renderRoot;
            renderRoot.render(view);
        } else {
            ReactDOM.render(view, mountpoint);
        }
    }

    async onDestroy(_mountpoint: Element): Promise<void> {
        if (USE_REACT_CONCURRENT_MODE) {
            const renderRoot = expectNotNull(this._renderRoot, '');
            renderRoot.unmount();
        } else {
            ReactDOM.unmountComponentAtNode(_mountpoint);
        }
        this._renderRoot = null;
    }

    async onResume(_mountpoint: Element): Promise<void> {
        throw new Error('Method not implemented.');
    }
    async onSuspend(_mountpoint: Element): Promise<void> {
        throw new Error('Method not implemented.');
    }
}

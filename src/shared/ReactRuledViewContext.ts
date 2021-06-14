// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="react-dom/next" />

import type { Nullable } from 'option-t/esm/Nullable/Nullable';
import { expectNotNull } from 'option-t/esm/Nullable/expect';
import * as ReactDOM from 'react-dom';

import type { ViewContext } from './ViewContext';

export abstract class ReactRuledViewContext implements ViewContext {
    private _renderRoot: Nullable<ReactDOM.Root>;

    constructor() {
        this._renderRoot = null;
    }

    protected _initRenderRoot(mountpoint: Element): void {
        if (!!this._renderRoot) {
            throw new TypeError('the react render root has been initialized');
        }

        this._renderRoot = ReactDOM.createRoot(mountpoint);
    }

    protected _destroyRenderRoot(): void {
        const renderRoot = expectNotNull(this._renderRoot, 'should has been initialized the renderRoot');
        renderRoot.unmount();
        this._renderRoot = null;
    }

    protected _getRenderRoot(): ReactDOM.Root {
        return expectNotNull(this._renderRoot, 'should has been initialized the renderRoot');
    }

    abstract onActivate(mountpoint: Element): Promise<void>;

    abstract onDestroy(mountpoint: Element): Promise<void>;

    onResume(_mountpoint: Element): Promise<void> {
        throw new Error('Method not implemented.');
    }

    onSuspend(_mountpoint: Element): Promise<void> {
        throw new Error('Method not implemented.');
    }
}

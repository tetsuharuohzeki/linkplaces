// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="react-dom/next" resolution-mode="require" />

import { type Nullable, isNotNull } from 'option-t/Nullable/Nullable';
import { expectNotNull } from 'option-t/Nullable/expect';
import * as ReactDOM from 'react-dom';

import type { ViewContext } from './ViewContext.js';

export abstract class ReactRuledViewContext implements ViewContext {
    private _renderRoot: Nullable<ReactDOM.Root>;

    constructor() {
        this._renderRoot = null;
    }

    abstract destroy(): void;

    protected _initRenderRoot(mountpoint: Element): void {
        if (isNotNull(this._renderRoot)) {
            throw new TypeError('the react render root has been initialized');
        }

        this._renderRoot = ReactDOM.createRoot(mountpoint);
    }

    protected _destroyRenderRoot(): void {
        const renderRoot = expectNotNull(
            this._renderRoot,
            'should has been initialized the renderRoot'
        );
        renderRoot.unmount();
        this._renderRoot = null;
    }

    protected _getRenderRoot(): ReactDOM.Root {
        return expectNotNull(
            this._renderRoot,
            'should has been initialized the renderRoot'
        );
    }

    abstract onActivate(mountpoint: Element): Promise<void>;

    abstract onDestroy(mountpoint: Element): Promise<void>;
}

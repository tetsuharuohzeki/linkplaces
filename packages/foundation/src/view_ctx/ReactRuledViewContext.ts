import { type Nullable, isNotNull } from 'option-t/Nullable/Nullable';
import { expectNotNull } from 'option-t/Nullable/expect';

import type { Root, createRoot } from 'react-dom/client' assert {
    'resolution-mode': 'require'
};
// @ts-expect-error
import * as ReactDOM from 'react-dom/client';

import type { ViewContext } from './ViewContext.js';

export abstract class ReactRuledViewContext implements ViewContext {
    private _renderRoot: Nullable<Root>;

    constructor() {
        this._renderRoot = null;
    }

    abstract destroy(): void;

    protected _initRenderRoot(mountpoint: Element): void {
        if (isNotNull(this._renderRoot)) {
            throw new TypeError('the react render root has been initialized');
        }

        const createRootByReactDOM: typeof createRoot = ReactDOM.createRoot;
        this._renderRoot = createRootByReactDOM(mountpoint);
    }

    protected _destroyRenderRoot(): void {
        const renderRoot = expectNotNull(
            this._renderRoot,
            'should has been initialized the renderRoot'
        );
        renderRoot.unmount();
        this._renderRoot = null;
    }

    protected _getRenderRoot(): Root {
        return expectNotNull(
            this._renderRoot,
            'should has been initialized the renderRoot'
        );
    }

    abstract onActivate(mountpoint: Element): Promise<void>;

    abstract onDestroy(mountpoint: Element): Promise<void>;
}

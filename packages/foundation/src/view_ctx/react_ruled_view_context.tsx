import { type Nullable, isNotNull, expectNotNull } from 'option-t/nullable';

import { StrictMode, type ReactNode } from 'react';
import { type Root, type RootOptions, createRoot } from 'react-dom/client';

import { getMountPoint } from './landing_pad.js';
import type { ViewContext } from './view_context.js';

export abstract class ReactRuledViewContext implements ViewContext {
    private _renderRoot: Nullable<Root> = null;

    abstract destroy(): void;

    protected _initRenderRoot(mountpoint: Element): void {
        if (isNotNull(this._renderRoot)) {
            throw new TypeError('the react render root has been initialized');
        }

        this._renderRoot = createRoot(mountpoint);
    }

    protected _destroyRenderRoot(): void {
        const renderRoot = expectNotNull(this._renderRoot, 'should has been initialized the renderRoot');
        renderRoot.unmount();
        this._renderRoot = null;
    }

    protected _getRenderRoot(): Root {
        return expectNotNull(this._renderRoot, 'should has been initialized the renderRoot');
    }

    abstract onActivate(mountpoint: Element): Promise<void>;

    abstract onDestroy(mountpoint: Element): Promise<void>;
}

export type ReactViewRenderFn = (view: ReactNode) => void;

export type InitFn = (renderRoot: ReactViewRenderFn) => Promise<TeardownFn>;

export type TeardownFn = () => void;

export async function renderReactView(init: InitFn, rootOptions?: RootOptions): Promise<TeardownFn> {
    const mountpoint = getMountPoint(document);
    const renderRoot = createRoot(mountpoint, rootOptions);
    const render: ReactViewRenderFn = (view: ReactNode): void => {
        const tree = <StrictMode>{view}</StrictMode>;
        renderRoot.render(tree);
    };
    const teardown = await init(render);

    return () => {
        renderRoot.unmount();
        teardown();
    };
}

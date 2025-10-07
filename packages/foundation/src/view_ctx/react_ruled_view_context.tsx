import { StrictMode, type ReactNode } from 'react';
import { type RootOptions, createRoot } from 'react-dom/client';

import { getMountPoint } from './landing_pad.js';

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

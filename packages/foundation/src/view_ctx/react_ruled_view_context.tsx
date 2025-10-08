import { StrictMode, type ReactNode } from 'react';
import { type RootOptions, createRoot } from 'react-dom/client';

import { getMountPoint } from './landing_pad.js';

export type ReactViewRenderFn = (view: ReactNode) => void;

export type ReactViewRenderInitFn = (renderRoot: ReactViewRenderFn) => Promise<ReactViewTeardownFn>;

export type ReactViewTeardownFn = () => void;

export async function renderReactView(
    init: ReactViewRenderInitFn,
    rootOptions?: RootOptions
): Promise<ReactViewTeardownFn> {
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

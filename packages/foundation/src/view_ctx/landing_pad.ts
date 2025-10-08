import { expectNotNull } from 'option-t/nullable';

import type { ViewContext } from './view_context.js';

const DOM_MOUNTPOINT_ID = 'js-mountpoint';

export async function landViewContext(ctx: ViewContext): Promise<void> {
    const mountpoint = getMountPoint(document);
    await ctx.onActivate(mountpoint);
}

export function getMountPoint(document: Document): Element {
    const element = document.getElementById(DOM_MOUNTPOINT_ID);
    const mountpoint = expectNotNull(element, 'not found mountpoint');
    return mountpoint;
}

export function setupTeardownOnPageHide(win: Window, onPageHide: (event: PageTransitionEvent) => void): void {
    win.addEventListener('pagehide', onPageHide, {
        once: true,
    });
}

import { expectNotNull } from 'option-t/Nullable';

import type { ViewContext } from './ViewContext.js';

const DOM_MOUNTPOINT_ID = 'js-mountpoint';

export async function landViewContext(ctx: ViewContext): Promise<void> {
    const element = document.getElementById(DOM_MOUNTPOINT_ID);
    const mountpoint = expectNotNull(element, 'not found mountpoint');
    await ctx.onActivate(mountpoint);
}

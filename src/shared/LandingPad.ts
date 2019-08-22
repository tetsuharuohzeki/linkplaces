import { isNull } from 'option-t/esm/Nullable/Nullable';
import { ViewContext } from './ViewContext';

const DOM_MOUNTPOINT_ID = 'js-mountpoint';

export async function landViewContext(ctx: ViewContext): Promise<void> {
    const mountpoint = document.getElementById(DOM_MOUNTPOINT_ID);
    if (isNull(mountpoint)) {
        throw new TypeError('not found mountpoint');
    }

    await ctx.onActivate(mountpoint);
}

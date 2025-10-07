import type { ViewContext } from '@linkplaces/foundation/view_ctx';
import { browser } from '@linkplaces/webext_types';
import { expectNotNull } from 'option-t/nullable';

import { createOptionsView } from './options_view.jsx';

function getUrl(path: string): { url: string; title: string } {
    const url = browser.runtime.getURL(path);
    return {
        url,
        title: path,
    };
}

export class OptionsContext implements ViewContext {
    constructor() {}

    destroy(): void {}

    async onActivate(mountpoint: Element): Promise<void> {
        const list = [getUrl('popup/index.html'), getUrl('sidebar/index.html'), getUrl('options/index.html')];

        const view = createOptionsView({
            list,
        });

        mountpoint.appendChild(view);
    }

    async onDestroy(mountpoint: Element): Promise<void> {
        while (mountpoint.firstChild) {
            const lastChild = expectNotNull(mountpoint.lastChild, '.lastChild should be exist');
            mountpoint.removeChild(lastChild);
        }
    }
}

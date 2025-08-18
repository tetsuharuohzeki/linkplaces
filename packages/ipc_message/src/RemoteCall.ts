import type { BookmarkId, WebExtSidebarActionService } from '@linkplaces/webext_types';
import { experimental_UndefinableOperator as UndefinableOperator } from 'option-t/undefinable';

import { type WhereToOpenItem, createOpenUrlAction, createRegisterUrlAction } from './RemoteAction.js';
import type { RemoteActionChannel } from './RemoteActionChannel.js';

export function openItemOneshot(
    chan: RemoteActionChannel,
    bookmarkId: BookmarkId,
    url: string,
    where: WhereToOpenItem
): void {
    const a = createOpenUrlAction(bookmarkId, url, where);
    chan.postOneShotMessage(a);
}

export async function openWebExtSidebar(sidebarAction: WebExtSidebarActionService): Promise<void> {
    // This method should be called by user interaction.
    try {
        await sidebarAction.open();
    } catch (e: unknown) {
        console.error(e);
    }
}

export function registerItem(chan: RemoteActionChannel, url: string, title?: string): void {
    const t = UndefinableOperator.unwrapOr(title, url);
    const a = createRegisterUrlAction(url, t);
    chan.postOneShotMessage(a);
}

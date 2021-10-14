import { ClientConnection } from '@linkplaces/foundation/tower_like_ipc';
import type { ExtensionPort } from '@linkplaces/webext_types';

import { CONNECTION_PING_FROM_POPUP, RemoteAction } from './RemoteAction.js';

export type { ClientConnection } from '@linkplaces/foundation/tower_like_ipc';

function connectToBgScript(pingMessage: string): ExtensionPort {
    const p = browser.runtime.connect({
        name: pingMessage,
    });
    return p;
}

export type RemoteActionChannel = ClientConnection<RemoteAction>;

export async function createChannel(): Promise<RemoteActionChannel> {
    const port = connectToBgScript(CONNECTION_PING_FROM_POPUP);
    const c = new ClientConnection<RemoteAction>(port);
    return c;
}

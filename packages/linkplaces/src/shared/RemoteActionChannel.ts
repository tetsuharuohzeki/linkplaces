import type { ExtensionPort } from '@linkplaces/webext_types';

import { ClientConnection } from '../foundation/tower_like_ipc/ClientConnection';
import { CONNECTION_PING_FROM_POPUP, RemoteAction } from './RemoteAction';

export type { ClientConnection } from '../foundation/tower_like_ipc/ClientConnection';

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

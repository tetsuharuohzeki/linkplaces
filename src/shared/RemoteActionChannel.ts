import type { ExtensionPort } from '../../typings/webext/ExtensionPort';

import { CONNECTION_PING_FROM_POPUP, RemoteAction } from './RemoteAction';
import { ClientConnection } from './tower_like_ipc/ClientConnection';
export type { ClientConnection } from './tower_like_ipc/ClientConnection';

function connectToBgScript(pingMessage: string): Promise<ExtensionPort> {
    const p = browser.runtime.connect({
        name: pingMessage,
    });
    return p;
}

export type RemoteActionChannel = ClientConnection<RemoteAction>;

export async function createChannel(): Promise<RemoteActionChannel> {
    const port = await connectToBgScript(CONNECTION_PING_FROM_POPUP);
    const c = new ClientConnection<RemoteAction>(port);
    return c;
}

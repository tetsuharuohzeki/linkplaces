import { Ipc } from '@linkplaces/foundation';
import type { ExtensionPort } from '@linkplaces/webext_types';

import { CONNECTION_PING_FROM_POPUP, RemoteAction } from './RemoteAction';

export type ClientConnection<TPayload> = Ipc.ClientConnection<TPayload>;

function connectToBgScript(pingMessage: string): ExtensionPort {
    const p = browser.runtime.connect({
        name: pingMessage,
    });
    return p;
}

export type RemoteActionChannel = ClientConnection<RemoteAction>;

export async function createChannel(): Promise<RemoteActionChannel> {
    const port = connectToBgScript(CONNECTION_PING_FROM_POPUP);
    const c = new Ipc.ClientConnection<RemoteAction>(port);
    return c;
}

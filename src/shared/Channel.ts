import type { Port } from '../../typings/webext/runtime';

import type { RemoteActionBase } from './RemoteAction';
import { ClientConnection } from './tower_like_ipc/ClientConnection';
export type { ClientConnection } from './tower_like_ipc/ClientConnection';

function connectToBgScript(pingMessage: string): Promise<Port> {
    const p = browser.runtime.connect({
        name: pingMessage,
    });
    return p;
}

export async function createClientConnectionToBackground<T extends RemoteActionBase>(pingMessage: string): Promise<ClientConnection<T>> {
    const port = await connectToBgScript(pingMessage);
    const c = new ClientConnection<T>(port);
    return c;
}



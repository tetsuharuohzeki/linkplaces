import { Port } from '../../../typings/webext/runtime';

import { Channel } from '../shared/Channel';
import { CONNECTION_PING_FROM_POPUP } from '../shared/MessageValue';

function connectToBgScript(pingMessage: string): Promise<Port<void>> {
    const p = browser.runtime.connect<void>({
        name: pingMessage,
    });
    return p;
}

export async function createChannel(): Promise<Channel> {
    const port = await connectToBgScript(CONNECTION_PING_FROM_POPUP);
    const c = new Channel(port);
    return c;
}

import { MessageClient } from '@linkplaces/foundation/tower_like_ipc';
import type { ExtensionRuntime } from '@linkplaces/webext_types';

import type { RemoteAction } from './RemoteAction.js';

export type RemoteActionChannel = MessageClient<RemoteAction>;

export async function createChannel(runtime: ExtensionRuntime): Promise<RemoteActionChannel> {
    const c = new MessageClient<RemoteAction>(runtime);
    return c;
}

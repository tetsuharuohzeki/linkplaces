import { ToBackgroundMessageSender, type RpcMessageSendable } from '@linkplaces/foundation/tower_like_ipc';
import type { ExtensionRuntime } from '@linkplaces/webext_types';

import type { RemoteAction } from './remote_action.js';

export type RemoteActionChannel = RpcMessageSendable<RemoteAction>;

export async function createChannel(runtime: ExtensionRuntime): Promise<RemoteActionChannel> {
    const c = new ToBackgroundMessageSender<RemoteAction>(runtime);
    return c;
}

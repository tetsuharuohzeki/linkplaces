import {
    InProcessMessageSender,
    ToBackgroundMessageSender,
    type InProcessMessageReceiverFn,
    type RpcMessageSendable,
} from '@linkplaces/foundation/tower_like_ipc';
import type { ExtensionRuntime } from '@linkplaces/webext_types';

import type { RemoteAction } from './remote_action.js';

export type RemoteActionChannel = RpcMessageSendable<RemoteAction>;

export async function createChannelForBackgroundService(runtime: ExtensionRuntime): Promise<RemoteActionChannel> {
    const c = new ToBackgroundMessageSender<RemoteAction>(runtime);
    return c;
}

export function createChannelForInProcess(fn: InProcessMessageReceiverFn): RemoteActionChannel {
    const c = new InProcessMessageSender<RemoteAction>(fn);
    return c;
}

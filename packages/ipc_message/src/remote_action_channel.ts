import { SendMessageSender } from '@linkplaces/foundation/tower_like_ipc';
import type { ExtensionRuntime } from '@linkplaces/webext_types';

import type { RemoteAction } from './remote_action.js';

export type RemoteActionChannel = SendMessageSender<RemoteAction>;

export async function createChannel(runtime: ExtensionRuntime): Promise<RemoteActionChannel> {
    const c = new SendMessageSender<RemoteAction>(runtime);
    return c;
}

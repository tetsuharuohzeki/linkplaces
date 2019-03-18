import { createChannelToBackground as create, Channel } from '../shared/Channel';
import { CONNECTION_PING_FROM_SIDEBAR, RemoteAction } from '../shared/RemoteAction';

export type RemoteActionChannel = Channel<RemoteAction>;

export async function createChannel(): Promise<RemoteActionChannel> {
    return create(CONNECTION_PING_FROM_SIDEBAR);
}

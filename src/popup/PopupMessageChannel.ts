import { createClientConnectionToBackground as create, ClientConnection as Channel } from '../shared/Channel';
import { CONNECTION_PING_FROM_POPUP, RemoteAction } from '../shared/RemoteAction';

export type RemoteActionChannel = Channel<RemoteAction>;

export async function createChannel(): Promise<RemoteActionChannel> {
    return create(CONNECTION_PING_FROM_POPUP);
}

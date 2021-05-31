import { createClientConnectionToBackground as create, ClientConnection } from '../shared/Channel';
import { CONNECTION_PING_FROM_POPUP, RemoteAction } from '../shared/RemoteAction';

export type RemoteActionChannel = ClientConnection<RemoteAction>;

export async function createChannel(): Promise<RemoteActionChannel> {
    return create(CONNECTION_PING_FROM_POPUP);
}

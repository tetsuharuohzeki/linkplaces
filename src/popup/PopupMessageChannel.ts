import { createChannelToBackground as create, Channel } from '../shared/Channel';
import { CONNECTION_PING_FROM_POPUP } from '../shared/RemoteAction';

export async function createChannel(): Promise<Channel> {
    return create(CONNECTION_PING_FROM_POPUP);
}

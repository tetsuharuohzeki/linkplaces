import type { Nullable } from 'option-t/Nullable/Nullable';

import type { TowerService } from '../framework/service_trait.js';
import type { Packet } from './Packet.js';

export interface PacketCreationService<in TRequestBody, out TResponse>
    extends TowerService<[req: Packet<TRequestBody>], Nullable<Packet<TResponse>>> {}

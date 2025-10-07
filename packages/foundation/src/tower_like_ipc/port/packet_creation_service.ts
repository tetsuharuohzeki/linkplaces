import type { Nullable } from 'option-t/nullable';

import type { TowerService } from '../framework/service_trait.js';
import type { Packet } from './packet_type.js';

export interface PacketCreationService<in TRequestBody, out TResponse>
    extends TowerService<[req: Packet<TRequestBody>], Nullable<Packet<TResponse>>> {}

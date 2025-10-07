import type { Nullable } from 'option-t/nullable';

import type { AssertTypeGuardFn } from '../assert_type_guard_fn.js';
import type { TowerService } from '../framework/service_trait.js';
import { assertIdentifiablePacket, createIdentifiablePacket, type Packet } from './packet.js';
import type { PacketCreationService } from './packet_creation_service.js';

export class ReplyPacketResponder<const in TInnerArgs, const out TInnerOutput>
    implements PacketCreationService<Packet<unknown>, TInnerOutput>
{
    private _validator: AssertTypeGuardFn<TInnerArgs>;
    private _source: TowerService<[req: TInnerArgs], TInnerOutput>;

    constructor(validator: AssertTypeGuardFn<TInnerArgs>, source: TowerService<[req: TInnerArgs], TInnerOutput>) {
        this._validator = validator;
        this._source = source;
    }

    destroy(): void {
        this._source = null as never;
        this._validator = null as never;
    }

    async process(req: Packet<unknown>): Promise<Nullable<Packet<TInnerOutput>>> {
        assertIdentifiablePacket(req);

        const { id, payload } = req;
        this._validator(payload);
        const result: TInnerOutput = await this._source.process(payload);
        const response = createIdentifiablePacket(id, result);
        return response;
    }
}

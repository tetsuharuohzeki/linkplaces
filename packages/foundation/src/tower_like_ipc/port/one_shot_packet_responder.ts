import type { AssertTypeGuardFn } from '../assert_type_guard_fn.js';
import type { TowerService } from '../framework/service_trait.js';
import { assertOneShotPacket, type Packet } from './packet.js';
import type { PacketCreationService } from './packet_creation_service.js';

export class OneShotPacketResponder<const in TInnerArgs, const out TInnerOutput>
    implements PacketCreationService<unknown, null>
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

    async process(req: Packet<unknown>): Promise<null> {
        assertOneShotPacket(req);

        const payload = req.payload;
        this._validator(payload);
        await this._source.process(payload);
        return null;
    }
}

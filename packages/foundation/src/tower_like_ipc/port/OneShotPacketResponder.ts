import type { AssertTypeGuardFn } from '../AssertTypeGuardFn.js';
import type { TowerService } from '../framework/service_trait.js';
import { assertOneShotPacket, type Packet } from './Packet.js';
import type { PacketCreationService } from './PacketCreationService.js';

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

    async call(req: Packet<unknown>): Promise<null> {
        assertOneShotPacket(req);

        const payload = req.payload;
        this._validator(payload);
        await this._source.call(payload);
        return null;
    }
}

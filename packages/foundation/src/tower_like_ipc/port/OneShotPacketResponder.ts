import type { Result } from 'option-t/PlainResult';

import type { AssertTypeGuardFn } from '../AssertTypeGuardFn.js';
import type { TowerService } from '../traits.js';
import { assertOneShotPacket, type Packet } from './Packet.js';
import type { PacketCreationService } from './PacketCreationService.js';

export class OneShotPacketResponder<const TRequestBody, const out TResponse>
    implements PacketCreationService<unknown, null>
{
    private _validator: AssertTypeGuardFn<TRequestBody>;
    private _source: TowerService<[req: TRequestBody], TResponse>;

    constructor(validator: AssertTypeGuardFn<TRequestBody>, source: TowerService<[req: TRequestBody], TResponse>) {
        this._validator = validator;
        this._source = source;
    }

    destroy(): void {
        this._source = null as never;
        this._validator = null as never;
    }

    ready(): Promise<Result<void, Error>> {
        return this._source.ready();
    }

    async call(req: Packet<unknown>): Promise<null> {
        assertOneShotPacket(req);

        const payload = req.payload;
        this._validator(payload);
        await this._source.call(payload);
        return null;
    }
}

import type { Nullable } from 'option-t/Nullable/Nullable';
import type { Result } from 'option-t/PlainResult';

import type { AssertTypeGuardFn } from '../AssertTypeGuardFn.js';
import type { TowerService } from '../traits.js';
import { assertIdentifiablePacket, createIdentifiablePacket, type Packet } from './Packet.js';
import type { PacketCreationService } from './PacketCreationService.js';

export class ReplyPacketResponder<const TRequestBody, const out TResponse>
    implements PacketCreationService<unknown, TResponse>
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

    async call(req: Packet<unknown>): Promise<Nullable<Packet<TResponse>>> {
        assertIdentifiablePacket(req);

        const { id, payload } = req;
        this._validator(payload);
        const result: TResponse = await this._source.call(payload);
        const response = createIdentifiablePacket(id, result);
        return response;
    }
}

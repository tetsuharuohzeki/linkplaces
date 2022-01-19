import type { Result } from 'option-t/PlainResult';
import type { Nullable } from 'option-t/cjs/Nullable/Nullable';

import type { AssertTypeGuardFn } from './AssertTypeGuardFn.js';
import { assertIdentifiablePacket, createPacket, type Packet } from './Packet.js';
import type { PacketCreationService } from './PacketCreationService.js';
import type { TowerService } from './traits.js';

export class ReplyResponder<TRequestBody, TResponse> implements PacketCreationService<unknown, TResponse> {
    private _validator: AssertTypeGuardFn<TRequestBody>;
    private _source: TowerService<TRequestBody, TResponse>;

    constructor(validator: AssertTypeGuardFn<TRequestBody>, source: TowerService<TRequestBody, TResponse>) {
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
        const response = createPacket(id, result);
        return response;
    }
}

import type { Result } from 'option-t/PlainResult';
import type { Nullable } from 'option-t/cjs/Nullable/Nullable';

import { NoImplementationError } from '../NoImplementationError.js';

import type { AssertTypeGuardFn } from './AssertTypeGuardFn.js';
import { OneShotResponder } from './OneShotResponder.js';
import { isIdentifiablePacket, isOneShotPacket, type Packet } from './Packet.js';
import type { PacketCreationService } from './PacketCreationService.js';
import { ReplyResponder } from './ReplyResponder.js';
import type { TowerService } from './traits.js';

export class PacketResponder<TRequestBody, out TResponse> implements PacketCreationService<unknown, TResponse> {
    private _oneshotReponder: OneShotResponder<unknown, TResponse>;
    private _replyResponder: ReplyResponder<unknown, TResponse>;

    constructor(validator: AssertTypeGuardFn<TRequestBody>, source: TowerService<TRequestBody, TResponse>) {
        this._oneshotReponder = new OneShotResponder(validator, source);
        this._replyResponder = new ReplyResponder(validator, source);
    }

    destroy(): void {
        this._oneshotReponder.destroy();
        this._replyResponder.destroy();

        this._oneshotReponder = null as never;
        this._replyResponder = null as never;
    }

    async ready(): Promise<Result<void, Error>> {
        throw new NoImplementationError(``);
    }

    async call(req: Packet<unknown>): Promise<Nullable<Packet<TResponse>>> {
        if (isIdentifiablePacket(req)) {
            const res = await this._replyResponder.call(req);
            return res;
        }

        if (isOneShotPacket(req)) {
            const res = await this._oneshotReponder.call(req);
            return res;
        }

        throw new Error('unreachable!');
    }
}

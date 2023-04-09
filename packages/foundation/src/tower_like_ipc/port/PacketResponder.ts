import type { Nullable } from 'option-t/Nullable/Nullable';
import type { Result } from 'option-t/PlainResult';

import { NoImplementationError } from '../../NoImplementationError.js';
import type { AssertTypeGuardFn } from '../AssertTypeGuardFn.js';
import type { TowerService } from '../traits.js';

import { OneShotPacketResponder } from './OneShotPacketResponder.js';
import { isIdentifiablePacket, isOneShotPacket, type Packet } from './Packet.js';
import type { PacketCreationService } from './PacketCreationService.js';
import { ReplyPacketResponder } from './ReplyPacketResponder.js';

export class PacketResponder<const TRequestBody, const out TResponse>
    implements PacketCreationService<unknown, TResponse>
{
    private _oneshotReponder: OneShotPacketResponder<unknown, TResponse>;
    private _replyResponder: ReplyPacketResponder<unknown, TResponse>;

    constructor(validator: AssertTypeGuardFn<TRequestBody>, source: TowerService<TRequestBody, TResponse>) {
        this._oneshotReponder = new OneShotPacketResponder(validator, source);
        this._replyResponder = new ReplyPacketResponder(validator, source);
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

import type { Nullable } from 'option-t/nullable';
import type { AssertTypeGuardFn } from '../assert_type_guard_fn.js';
import type { TowerService } from '../framework/service_trait.js';

import { OneShotPacketResponder } from './one_shot_packet_responder.js';
import type { PacketCreationService } from './packet_creation_service.js';
import { isIdentifiablePacket, isOneShotPacket, type Packet } from './packet_type.js';
import { ReplyPacketResponder } from './reply_packet_responder.js';

export class PacketResponder<const in TRequestBody, const out TResponse>
    implements PacketCreationService<unknown, TResponse>
{
    private _oneshotReponder: OneShotPacketResponder<TRequestBody, TResponse>;
    private _replyResponder: ReplyPacketResponder<TRequestBody, TResponse>;

    constructor(validator: AssertTypeGuardFn<TRequestBody>, source: TowerService<[req: TRequestBody], TResponse>) {
        this._oneshotReponder = new OneShotPacketResponder(validator, source);
        this._replyResponder = new ReplyPacketResponder(validator, source);
    }

    destroy(): void {
        this._oneshotReponder.destroy();
        this._replyResponder.destroy();

        this._oneshotReponder = null as never;
        this._replyResponder = null as never;
    }

    async process(req: Packet<unknown>): Promise<Nullable<Packet<TResponse>>> {
        if (isIdentifiablePacket(req)) {
            const res = await this._replyResponder.process(req);
            return res;
        }

        if (isOneShotPacket(req)) {
            const res = await this._oneshotReponder.process(req);
            return res;
        }

        throw new Error('unreachable!');
    }
}

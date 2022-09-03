import type { ExtensionRuntime } from '@linkplaces/webext_types';
import type { Nullable } from 'option-t/Nullable/Nullable';
import { createOk, createErr, type Result } from 'option-t/PlainResult/Result';
import { createOneShotPacket, createRuntimeMessagePacket, isPacket } from './Packet.js';

export class MessageServerError extends Error {
    constructor(message: string, cause: Nullable<unknown>) {
        super(message, {
            cause,
        });
        this.name = new.target.name;
    }
}

export class MessageClient<in TPayload extends object> {
    private _runtime: ExtensionRuntime;

    constructor(runtime: ExtensionRuntime) {
        this._runtime = runtime;
    }

    private _finalize(): void {
        this._runtime = null as never;
    }

    destroy() {
        this._finalize();
    }

    async postMessage(payload: TPayload): Promise<Result<unknown, Error>> {
        const packet = createRuntimeMessagePacket(payload);

        let res: object;
        try {
            res = await this._runtime.sendMessage<object>(packet);
        } catch (e) {
            const message = String(e);
            const error = new MessageServerError(message, e);
            const failure = createErr(error);
            return failure;
        }

        if (!isPacket(res)) {
            const error = new MessageServerError('the reponse is not Packet<T>', null);
            const failure = createErr(error);
            return failure;
        }

        const r = createOk(res.payload);
        return r;
    }

    postOneShotMessage(payload: TPayload): void {
        const packet = createOneShotPacket<TPayload>(payload);
        this._runtime.sendMessage(packet).catch(console.error);
    }
}

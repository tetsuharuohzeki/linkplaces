import type { ExtensionRuntime } from '@linkplaces/webext_types';
import type { Nullable } from 'option-t/nullable';
import { createOk, createErr, type Result } from 'option-t/plain_result';

export class MessageResponderSideError extends Error {
    constructor(message: string, cause: Nullable<unknown>) {
        super(message, {
            cause,
        });
        this.name = new.target.name;
    }
}

export class SendMessageSender<const in TPayload extends object> {
    private _runtime: ExtensionRuntime;

    constructor(runtime: ExtensionRuntime) {
        this._runtime = runtime;
    }

    private _finalize(): void {
        this._runtime = null as never;
    }

    destroy(): void {
        this._finalize();
    }

    async postMessage(payload: TPayload): Promise<Result<unknown, Error>> {
        let res: object;
        try {
            res = await this._runtime.sendMessage<object>(payload);
        } catch (e) {
            const message = String(e);
            const error = new MessageResponderSideError(message, e);
            const failure = createErr(error);
            return failure;
        }

        const r = createOk(res);
        return r;
    }

    postOneShotMessage(payload: TPayload): void {
        this._runtime.sendMessage(payload).catch(console.error);
    }
}

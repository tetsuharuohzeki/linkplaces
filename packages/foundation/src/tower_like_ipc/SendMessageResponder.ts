import type { ExtensionMessageSender } from '@linkplaces/webext_types';
import type { AssertTypeGuardFn } from './AssertTypeGuardFn.js';

import type { TowerService } from './framework/service_trait.js';

export class SendMessageResponder<const in out TRequest, const in out TResponse> {
    private _validator: AssertTypeGuardFn<TRequest>;
    private _service: TowerService<[req: TRequest], TResponse>;

    constructor(validator: AssertTypeGuardFn<TRequest>, service: TowerService<[req: TRequest], TResponse>) {
        this._validator = validator;
        this._service = service;
    }

    destory(): void {
        this._service = null as never;
        this._validator = null as never;
    }

    async onMessage(message: object, _sender: ExtensionMessageSender): Promise<unknown> {
        this._validator(message);
        const res = this._callService(message);
        return res;
    }

    private async _callService(packet: TRequest): Promise<TResponse> {
        const res = await this._service.call(packet);
        return res;
    }
}

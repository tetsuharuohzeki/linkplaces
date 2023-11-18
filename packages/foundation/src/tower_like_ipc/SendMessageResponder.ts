import type { ExtensionMessageSender } from '@linkplaces/webext_types';
import type { AssertTypeGuardFn } from './AssertTypeGuardFn.js';

import type { TowerService } from './framework/service_trait.js';

type ResponderService<TRequest, TResponse> = TowerService<[req: TRequest], TResponse>;

export class SendMessageResponder<const in out TRequest, const in out TResponse> {
    private _validator: AssertTypeGuardFn<TRequest>;
    private _service: ResponderService<TRequest, TResponse>;

    constructor(validator: AssertTypeGuardFn<TRequest>, service: ResponderService<TRequest, TResponse>) {
        this._validator = validator;
        this._service = service;
    }

    destory(): void {
        this._service = null as never;
        this._validator = null as never;
    }

    async onMessage(message: object, sender: ExtensionMessageSender): Promise<unknown> {
        const res = await callResponderServiceWithMessage(this._service, this._validator, message, sender);
        return res;
    }
}

export async function callResponderServiceWithMessage<const TRequest, const TResponse>(
    service: ResponderService<TRequest, TResponse>,
    messageValidator: AssertTypeGuardFn<TRequest>,
    message: object,
    _sender: ExtensionMessageSender
): Promise<unknown> {
    messageValidator(message);
    const res = await service.call(message);
    return res;
}

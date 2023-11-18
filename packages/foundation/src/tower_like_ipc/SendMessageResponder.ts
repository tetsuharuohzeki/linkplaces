import type { ExtensionMessageSender } from '@linkplaces/webext_types';
import type { AssertTypeGuardFn } from './AssertTypeGuardFn.js';

import type { TowerService } from './framework/service_trait.js';

type ResponderService<TRequest, TResponse> = TowerService<[req: TRequest], TResponse>;

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

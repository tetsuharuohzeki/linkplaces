import type { ExtensionMessageSender } from '@linkplaces/webext_types';
import type { AssertTypeGuardFn } from './AssertTypeGuardFn.js';

export async function callResponderServiceWithMessage<const TRequest, const TResponse>(
    serviceFn: (req: TRequest) => Promise<TResponse>,
    messageValidator: AssertTypeGuardFn<TRequest>,
    message: object,
    _sender: ExtensionMessageSender
): Promise<unknown> {
    messageValidator(message);
    const res = await serviceFn(message);
    return res;
}

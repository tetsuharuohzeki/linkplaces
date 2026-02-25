import type { ExtensionMessageSender } from '@linkplaces/webext_types';
import type { AssertTypeGuardFn } from './assert_type_guard_fn.js';
import type { MessageRespondableServiceFn } from './message_sendable.js';

export async function callResponderServiceWithMessage<const TRequest, const TResponse>(
    serviceFn: MessageRespondableServiceFn<TRequest, TResponse>,
    messageValidator: AssertTypeGuardFn<TRequest>,
    message: object,
    _sender: ExtensionMessageSender
): Promise<unknown> {
    messageValidator(message);
    const res = await serviceFn(message);
    return res;
}

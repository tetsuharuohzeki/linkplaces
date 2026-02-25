import type { AssertTypeGuardFn } from './assert_type_guard_fn.js';
import type { RpcMessageRespondableServiceFn } from './message_sendable.js';

export async function callResponderServiceWithMessage<const TRequest, const TResponse>(
    serviceFn: RpcMessageRespondableServiceFn<TRequest, TResponse>,
    messageValidator: AssertTypeGuardFn<TRequest>,
    message: object
): Promise<unknown> {
    messageValidator(message);
    const res = await serviceFn(message);
    return res;
}

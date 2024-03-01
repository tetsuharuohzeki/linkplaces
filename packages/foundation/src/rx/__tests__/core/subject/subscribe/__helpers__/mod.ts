import { InternalSubscriber } from '../../../../../core/subscriber_impl.js';
import type { CompletionResult } from '../../../../../mod.js';

export class TestSubscriber<T> extends InternalSubscriber<T> {
    override onNext(_value: T): void {}
    override onError(_error: unknown): void {}
    override onCompleted(_result: CompletionResult): void {}
}

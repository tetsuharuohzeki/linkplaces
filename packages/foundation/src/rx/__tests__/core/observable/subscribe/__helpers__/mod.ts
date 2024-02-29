import { InternalSubscriber } from '../../../../../core/subscriber_impl.js';
import {
    Observable,
    type OnSubscribeFn,
    type CompletionResult,
} from '../../../../../mod.js';

export class TestObservable<T> extends Observable<T> {
    constructor(onSubscribe: OnSubscribeFn<T>) {
        super(onSubscribe);
    }
}

export class TestSubscriber<T> extends InternalSubscriber<T> {
    override onNext(_value: T): void {}
    override onErrorResume(_error: unknown): void {}
    override onCompleted(_result: CompletionResult): void {}
}

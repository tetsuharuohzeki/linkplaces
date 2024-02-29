import { Observable, type OnSubscribeFn } from '../../../../../mod.js';

export class TestObservable<T> extends Observable<T> {
    constructor(onSubscribe: OnSubscribeFn<T>) {
        super(onSubscribe);
    }
}

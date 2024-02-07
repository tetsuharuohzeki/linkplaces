import type { Subscriber } from '../subscriber.js';
import { Subject } from './subject.js';

export class BehaviorSubject<T> extends Subject<T> {
    private _value: T;
    constructor(initial: T) {
        super();
        this._value = initial;
        const superSubscribe = this._getOnSubscribe();
        const sub = (subscriber: Subscriber<unknown, T>) => {
            const subscription = superSubscribe(subscriber);
            subscriber.next(this._value);
            return subscription;
        };
        this._setOnSubscribe(sub);
    }

    value(): T {
        return this._value;
    }

    override next(value: T): void {
        this._value = value;
        super.next(value);
    }
}

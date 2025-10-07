import { Subject } from '../core/subject.js';
import type { Subscriber } from '../core/subscriber.js';

export class BehaviorSubject<T> extends Subject<T> {
    private _value: T;
    constructor(initial: T) {
        super();
        this._value = initial;
    }

    protected override _onInitialValueEmittablePointInSubjectSubscribe(destination: Subscriber<T>): void {
        destination.next(this._value);
    }

    value(): T {
        return this._value;
    }

    override next(value: T): void {
        this._value = value;
        super.next(value);
    }
}

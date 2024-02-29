import { Subject } from '../core/subject.js';
import type { Subscriber } from '../core/subscriber.js';

export class BehaviorSubject<T> extends Subject<T> {
    private _value: T;
    constructor(initial: T) {
        super();
        this._value = initial;
    }

    protected override onSubscribe(destination: Subscriber<T>): void {
        if (this.isCompleted) {
            this.onSubscribeButCompleted(destination);
            return;
        } else {
            destination.next(this._value);
        }

        this.registerObserverOnSubscribe(destination);
    }

    value(): T {
        return this._value;
    }

    override next(value: T): void {
        if (this.isCompleted) {
            return;
        }

        this._value = value;
        super.next(value);
    }
}

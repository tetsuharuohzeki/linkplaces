import { Subject } from '../core/subject.js';
import type { Subscriber } from '../core/subscriber.js';

export class BehaviorSubject<T> extends Subject<T> {
    private _value: T;
    constructor(initial: T) {
        super();
        this._value = initial;
    }

    protected override _onSubjectSubscribe(destination: Subscriber<T>): void {
        if (this.isCompleted) {
            this._onSubscribeButCompleted(destination);
            return;
        } else {
            destination.next(this._value);
        }

        this._registerObserverOnSubscribe(destination);
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

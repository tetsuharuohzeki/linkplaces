import type { Observer } from '../observer.js';
import type { Unsubscribable } from '../subscribable.js';
import { Subscription } from '../subscription.js';
import { Subject } from './subject.js';

export class BehaviorSubject<T> extends Subject<T> {
    private _value: T;
    constructor(initial: T) {
        super();
        this._value = initial;
    }

    protected override onSubscribe(observer: Observer<T>): Unsubscribable {
        if (this.isCompleted) {
            observer.next(this._value);
            this.onSubscribeButCompleted(observer);
            return new Subscription(null);
        }
        observer.next(this._value);

        const sub = this.registerObserverOnSubscribe(observer);
        return sub;
    }

    value(): T {
        return this._value;
    }

    override next(value: T): void {
        this._value = value;
        super.next(value);
    }
}

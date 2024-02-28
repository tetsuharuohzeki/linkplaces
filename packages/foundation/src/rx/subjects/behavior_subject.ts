import { Subject } from '../core/subject.js';
import type { Unsubscribable } from '../core/subscribable.js';
import type { Subscriber } from '../core/subscriber.js';
import { Subscription } from '../core/subscription.js';

export class BehaviorSubject<T> extends Subject<T> {
    private _value: T;
    constructor(initial: T) {
        super();
        this._value = initial;
    }

    protected override onSubscribe(destination: Subscriber<T>): Unsubscribable {
        if (this.isCompleted) {
            this.onSubscribeButCompleted(destination);
            return new Subscription(null);
        } else {
            destination.next(this._value);
        }

        const sub = this.registerObserverOnSubscribe(destination);
        return sub;
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

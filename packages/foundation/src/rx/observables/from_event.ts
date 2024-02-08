import { Observable } from '../observable.js';
import { Subscription } from '../subscription.js';

class FromEventObservable extends Observable<Event> {
    constructor(target: EventTarget, eventName: string) {
        super((observer) => {
            const aborter = new AbortController();
            const signal = aborter.signal;

            target.addEventListener(
                eventName,
                (event) => {
                    observer.next(event);
                },
                {
                    signal,
                }
            );

            const sub = new Subscription(() => {
                aborter.abort();
            });
            return sub;
        });
    }
}

export function fromEventToObservable(target: EventTarget, eventName: string): Observable<Event> {
    const o = new FromEventObservable(target, eventName);
    return o;
}

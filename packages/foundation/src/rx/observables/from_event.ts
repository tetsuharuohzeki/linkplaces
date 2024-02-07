import { Observable } from '../observable.js';
import { Subscription } from '../subscription.js';

class FromEventObservable<T extends Event> extends Observable<T> {
    constructor(target: EventTarget, eventName: string) {
        super((observer) => {
            const aborter = new AbortController();
            const signal = aborter.signal;

            target.addEventListener(
                eventName,
                (event: Event) => {
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

export function fromEventToObservable<T extends Event>(target: EventTarget, eventName: string): Observable<T> {
    const o = new FromEventObservable<T>(target, eventName);
    return o;
}

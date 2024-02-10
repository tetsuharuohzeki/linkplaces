import { createOk } from 'option-t/esm/PlainResult';
import { Observable } from '../core/observable.js';
import type { Subscriber } from '../core/subscriber.js';
import { Subscription } from '../core/subscription.js';

class FromEventObservable extends Observable<Event> {
    constructor(target: EventTarget, eventName: string) {
        super((destination: Subscriber<Event>) => {
            const aborter = new AbortController();
            const signal = aborter.signal;

            target.addEventListener(
                eventName,
                (event) => {
                    destination.next(event);
                },
                {
                    signal,
                }
            );

            const sub = new Subscription(() => {
                aborter.abort();

                const ok = createOk<void>(undefined);
                destination.complete(ok);
            });
            return sub;
        });
    }
}

export function fromEventToObservable(target: EventTarget, eventName: string): Observable<Event> {
    const o = new FromEventObservable(target, eventName);
    return o;
}

import { createCompletionOk } from '../core/completion_result.js';
import { Observable } from '../core/observable.js';
import type { Subscriber } from '../core/subscriber.js';

class FromEventObservable extends Observable<Event> {
    constructor(target: EventTarget, eventName: string) {
        super((destination: Subscriber<Event>) => {
            const aborter = new AbortController();
            const signal = aborter.signal;
            destination.addTeardown(() => {
                aborter.abort();

                const ok = createCompletionOk();
                destination.complete(ok);
            });

            target.addEventListener(
                eventName,
                (event) => {
                    destination.next(event);
                },
                {
                    signal,
                }
            );
        });
    }
}

export function fromEventToObservable(target: EventTarget, eventName: string): Observable<Event> {
    const o = new FromEventObservable(target, eventName);
    return o;
}

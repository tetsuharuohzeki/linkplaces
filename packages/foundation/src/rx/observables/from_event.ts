import { Observable } from '../core/observable.js';
import type { Subscriber } from '../core/subscriber.js';

class FromEventObservable extends Observable<Event> {
    constructor(target: EventTarget, eventName: string) {
        super((destination: Subscriber<Event>) => {
            const aborter = new AbortController();
            const signal = aborter.signal;
            destination.addTeardown(() => {
                aborter.abort();

                destination.complete(null);
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

export function fromEventToObservableOnHTMLElement<TEventName extends keyof HTMLElementEventMap>(
    target: HTMLElement,
    eventName: TEventName
): Observable<HTMLElementEventMap[TEventName]> {
    const o = fromEventToObservable(target, eventName);
    return o;
}

export function fromEventToObservableOnWindow<TEventName extends keyof WindowEventMap>(
    target: Window,
    eventName: TEventName
): Observable<WindowEventMap[TEventName]> {
    const o = fromEventToObservable(target, eventName);
    return o;
}

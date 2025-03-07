import type { Nullable } from 'option-t/nullable';
import { Observable } from '../core/observable.js';
import type { Subscriber } from '../core/subscriber.js';

export enum FromEventObservableMode {
    NotPassive = 'not_passive',
    Passive = 'passive',
}

class FromEventObservable extends Observable<Event> {
    constructor(target: EventTarget, eventName: string, mode: Nullable<FromEventObservableMode>) {
        super((destination: Subscriber<Event>) => {
            const aborter = new AbortController();
            const signal = aborter.signal;
            destination.addTeardown(() => {
                aborter.abort();

                destination.complete(null);
            });

            const passive = mode === FromEventObservableMode.Passive;
            target.addEventListener(
                eventName,
                (event) => {
                    destination.next(event);
                },
                {
                    signal,
                    passive,
                }
            );
        });
    }
}

export function fromEventToObservable(
    target: EventTarget,
    eventName: string,
    mode?: Nullable<FromEventObservableMode>
): Observable<Event> {
    const o = new FromEventObservable(target, eventName, mode ?? null);
    return o;
}

export function fromEventToObservableOnHTMLElement<TEventName extends keyof HTMLElementEventMap>(
    target: HTMLElement,
    eventName: TEventName,
    mode?: Nullable<FromEventObservableMode>
): Observable<HTMLElementEventMap[TEventName]> {
    const o = fromEventToObservable(target, eventName, mode);
    return o;
}

export function fromEventToObservableOnWindow<TEventName extends keyof WindowEventMap>(
    target: Window,
    eventName: TEventName,
    mode?: Nullable<FromEventObservableMode>
): Observable<WindowEventMap[TEventName]> {
    const o = fromEventToObservable(target, eventName, mode);
    return o;
}

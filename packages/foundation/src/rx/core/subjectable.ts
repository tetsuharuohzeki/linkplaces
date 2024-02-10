import type { Unsubscribable } from './subscribable';
import type { Subscriber } from './subscriber';

export interface Subjectable<T> extends Subscriber<T> {
    subscribe(destination: Subscriber<T>): Unsubscribable;
}

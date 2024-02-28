import type { Observer } from '../mod';
import type { Unsubscribable } from './subscribable';
import type { Subscriber } from './subscriber';

export interface Subjectable<T> extends Observer<T> {
    subscribe(destination: Subscriber<T>): Unsubscribable;
}

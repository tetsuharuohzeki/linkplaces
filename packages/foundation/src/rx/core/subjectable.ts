import type { Observer } from './observer';
import type { Unsubscribable } from './subscribable';

export interface Subjectable<T> extends Observer<T> {
    subscribe(observer: Observer<T>): Unsubscribable;
}

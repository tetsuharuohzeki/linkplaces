import type { Observer } from './observer.js';

export interface Unsubscribable {
    unsubscribe(): void;
}

export interface Subscribable<T> {
    subscribe(observer: Partial<Observer<T>>): Unsubscribable;
}

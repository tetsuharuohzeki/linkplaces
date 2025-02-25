import type { Observer } from './observer';

export type TeardownFn = (this: void) => void;

export interface Subscriber<T> extends Observer<T> {
    isActive(): boolean;
    addTeardown(teardown: TeardownFn): void;

    /**
     *  This returns the event destination of this _subscriber_.
     *  This is provided to check an circulation.
     */
    destination(): Observer<T>;
}

import type { Observer } from './observer';

export type TeardownFn = (this: void) => void;

export interface Subscriber<T> extends Observer<T> {
    isActive(): boolean;
    addTeardown(teardown: TeardownFn): void;
}

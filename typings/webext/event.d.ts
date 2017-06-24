export interface Listener<T> {
    addListener(arg: T): void;
    removeListener(arg: T): void;
}

export interface ListenerHasCheckable<T> {
    hasListener(arg: T): void;
}

export type FullListener<T> = Listener<T> & ListenerHasCheckable<T>;

import { Nullable } from 'option-t/esm/Nullable/Nullable';
import { unwrapNullable } from 'option-t/esm/Nullable/unwrap';

export interface ActionArcheType<T = unknown> {
    type: T;
}

type Reducer<TState, TAction> = (initial: TState, action: TAction) => TState;
type SubscriberFn<TState> = (state: TState) => void;
type DisposerFn = () => void;

export class ReduxLikeStore<TState, TAction extends ActionArcheType> {
    static create<TState, TAction extends ActionArcheType>(reducer: Reducer<TState, TAction>, initial: Nullable<TState> = null): ReduxLikeStore<TState, TAction> {
        const s = new ReduxLikeStore(reducer, initial);
        return s;
    }

    private _backState: Nullable<TState>;
    private _reducer: Reducer<TState, TAction>;
    private _subscribers: Set<SubscriberFn<TState>>;

    private constructor(reducer: Reducer<TState, TAction>, initial: Nullable<TState>) {
        this._backState = initial;
        this._reducer = reducer;
        this._subscribers = new Set();
    }

    initWith(initial: TState): void {
        this._backState = initial;
    }

    dispatch(action: TAction): void {
        const state = unwrapNullable(this._backState);
        const reducer = this._reducer;
        const newState = reducer(state, action);
        this._backState = newState;

        for (const fn of this._subscribers) {
            try {
                fn(newState);
            } catch (e: unknown) {
                console.error(e);
            }
        }
    }

    state(): TState {
        const state = unwrapNullable(this._backState);
        return state;
    }

    subscribe(fn: SubscriberFn<TState>): DisposerFn {
        this._subscribers.add(fn);
        return () => {
            this._subscribers.delete(fn);
        };
    }
}

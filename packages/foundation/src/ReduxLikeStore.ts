export interface ActionArcheType<out T = unknown> {
    type: T;
}

type Reducer<in out TState, in TAction> = (initial: TState, action: TAction) => TState;
type SubscriberFn<in TState> = (state: TState) => void;
type DisposerFn = () => void;

export class ReduxLikeStore<const in out TState, const in TAction extends ActionArcheType> {
    static create<const TState, const TAction extends ActionArcheType>(
        reducer: Reducer<TState, TAction>,
        initial: TState
    ): ReduxLikeStore<TState, TAction> {
        const s = new ReduxLikeStore(reducer, initial);
        return s;
    }

    private _backState: TState;
    private _reducer: Reducer<TState, TAction>;
    private _subscribers: Set<SubscriberFn<TState>> = new Set();

    private constructor(reducer: Reducer<TState, TAction>, initial: TState) {
        this._backState = initial;
        this._reducer = reducer;
    }

    destory(): void {
        this._subscribers.clear();
        this._subscribers = null as never;
        this._reducer = null as never;
        this._backState = null as never;
    }

    initWith(initial: TState): void {
        this._backState = initial;
    }

    dispatch(action: TAction): void {
        const state = this._backState;
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
        const state = this._backState;
        return state;
    }

    subscribe(fn: SubscriberFn<TState>): DisposerFn {
        this._subscribers.add(fn);
        return () => {
            this._subscribers.delete(fn);
        };
    }
}

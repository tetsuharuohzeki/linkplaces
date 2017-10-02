export interface Intent<TDispatcher> {
    dispatcher(): TDispatcher;
}

export interface Dispatchable<TAction> {
    destroy(): void;
    dispatch(action: TAction): void;
}

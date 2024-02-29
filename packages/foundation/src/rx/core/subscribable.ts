export interface Unsubscribable {
    readonly closed: boolean;
    unsubscribe(): void;
}

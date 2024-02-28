export interface Unsubscribable {
    closed: boolean;
    unsubscribe(): void;
}

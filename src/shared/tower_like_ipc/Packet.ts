export interface Packet<T> {
    readonly id?: number;
    readonly payload: T;
    readonly isRequest: boolean;
}

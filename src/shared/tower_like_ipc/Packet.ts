export interface Packet<T> {
    readonly id?: number;
    readonly payload: T;
    readonly isRequest: boolean;
}

export function createPacket<T>(id: number, payload: T): Packet<T> {
    return {
        id,
        payload,
        isRequest: true,
    };
}

export function createOneShotPacket<T>(payload: T): Packet<T> {
    return {
        id: undefined,
        payload,
        isRequest: true,
    };
}

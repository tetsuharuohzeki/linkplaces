import type { Nullable } from 'option-t/esm/Nullable/Nullable';

export interface Packet<T> {
    readonly id: Nullable<number>;
    readonly payload: T;
}

export function createPacket<T>(id: number, payload: T): Packet<T> {
    return {
        id,
        payload,
    };
}

export function createOneShotPacket<T>(payload: T): Packet<T> {
    return {
        id: null,
        payload,
    };
}

import { isNull, Nullable } from 'option-t/esm/Nullable/Nullable';

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

const hasOwnProperty = Object.prototype.hasOwnProperty;

export function isPacket(value: object): value is Packet<unknown> {
    if (!hasPacketShape(value)) {
        return false;
    }

    const { id } = value;
    if (!(isNull(id) || typeof id === 'number')) {
        return false;
    }

    return true;
}

type Opaque<T> = {
    [P in keyof T]: unknown;
};

function hasPacketShape(value: object): value is Opaque<Packet<unknown>> {
    if (!hasOwnProperty.call(value, 'id')) {
        return false;
    }

    if (!hasOwnProperty.call(value, 'payload')) {
        return false;
    }

    return true;
}

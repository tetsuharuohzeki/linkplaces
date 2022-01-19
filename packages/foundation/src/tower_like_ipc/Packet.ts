import { isNotNull, isNull, type Nullable } from 'option-t/Nullable/Nullable';

export interface Packet<T> {
    readonly id: Nullable<number>;
    readonly payload: T;
}

export interface IdentifiablePacket<T> extends Packet<T> {
    readonly id: number;
}

export interface OneShotPacket<T> extends Packet<T> {
    readonly id: null;
}

export function createPacket<T>(id: number, payload: T): IdentifiablePacket<T> {
    return {
        id,
        payload,
    };
}

function isIdentifiablePacket(value: Packet<unknown>): value is OneShotPacket<unknown> {
    const id = value.id;
    const ok = isNotNull(id);
    return ok;
}

export function createOneShotPacket<T>(payload: T): OneShotPacket<T> {
    return {
        id: null,
        payload,
    };
}

function isOneShotPacket(value: Packet<unknown>): value is OneShotPacket<unknown> {
    const id = value.id;
    const ok = isNull(id);
    return ok;
}

const hasOwnProperty = Object.prototype.hasOwnProperty;

export function assertPacket(value: object): asserts value is Packet<unknown> {
    if (!isPacket(value)) {
        throw new TypeError(`${JSON.stringify(value)} is not Packet<unknown>`);
    }
}

export function assertIdentifiablePacket(value: Packet<unknown>): asserts value is IdentifiablePacket<unknown> {
    if (!isIdentifiablePacket(value)) {
        throw new TypeError(`${JSON.stringify(value)} is not IdentifiablePacket<unknown>`);
    }
}

export function assertOneShotPacket(value: Packet<unknown>): asserts value is OneShotPacket<unknown> {
    if (!isOneShotPacket(value)) {
        throw new TypeError(`${JSON.stringify(value)} is not OneShotPacket<unknown>`);
    }
}

function isPacket(value: object): value is Packet<unknown> {
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

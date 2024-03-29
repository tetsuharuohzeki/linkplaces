import { isNull } from 'option-t/Nullable';

export interface Packet<T> {
    readonly id: number;
    readonly payload: T;
}

export interface IdentifiablePacket<T> extends Packet<T> {}

const ONESHOT_PACKET_ID = -1;

export interface OneShotPacket<T> extends Packet<T> {
    readonly id: typeof ONESHOT_PACKET_ID;
}

export function createIdentifiablePacket<const T>(id: number, payload: T): IdentifiablePacket<T> {
    if (id <= ONESHOT_PACKET_ID) {
        throw new RangeError(`id must be greater than ${String(ONESHOT_PACKET_ID)}`);
    }

    return {
        id,
        payload,
    };
}

export function isIdentifiablePacket(value: Packet<unknown>): value is OneShotPacket<unknown> {
    const id = value.id;
    const ok = id > ONESHOT_PACKET_ID;
    return ok;
}

export function createOneShotPacket<const T>(payload: T): OneShotPacket<T> {
    return {
        id: ONESHOT_PACKET_ID,
        payload,
    };
}

export function isOneShotPacket(value: Packet<unknown>): value is OneShotPacket<unknown> {
    const id = value.id;
    const ok = id === ONESHOT_PACKET_ID;
    return ok;
}

export function assertPacket(value: unknown): asserts value is Packet<unknown> {
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

export function isPacket(value: unknown): value is Packet<unknown> {
    if (typeof value !== 'object') {
        return false;
    }

    if (isNull(value)) {
        return false;
    }

    if (!hasPacketShape(value)) {
        return false;
    }

    const { id } = value;
    if (typeof id !== 'number') {
        return false;
    }

    return true;
}

type Opaque<T> = {
    [P in keyof T]: unknown;
};

function hasPacketShape(value: object): value is Opaque<Packet<unknown>> {
    if (!Object.hasOwn(value, 'id')) {
        return false;
    }

    if (!Object.hasOwn(value, 'payload')) {
        return false;
    }

    return true;
}

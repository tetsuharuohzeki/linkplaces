import { isNull } from 'option-t/Nullable/Nullable';

export interface Packet<T> {
    readonly id: number;
    readonly payload: T;
}

export interface IdentifiablePacket<T> extends Packet<T> {}

const ONESHOT_PACKET_ID = -1;
const RUNTIME_MESSAGE_PACKET_ID = -2;

export interface OneShotPacket<T> extends Packet<T> {
    readonly id: typeof ONESHOT_PACKET_ID;
}

export interface RuntimeMessagePacket<T> extends Packet<T> {
    readonly id: typeof RUNTIME_MESSAGE_PACKET_ID;
}

export function createPacket<T>(id: number, payload: T): IdentifiablePacket<T> {
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

export function createOneShotPacket<T>(payload: T): OneShotPacket<T> {
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

export function createRuntimeMessagePacket<T>(payload: T): RuntimeMessagePacket<T> {
    return {
        id: RUNTIME_MESSAGE_PACKET_ID,
        payload,
    };
}

export function isRuntimeMessagePacket(value: Packet<unknown>): value is RuntimeMessagePacket<unknown> {
    const id = value.id;
    const ok = id === RUNTIME_MESSAGE_PACKET_ID;
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

export function assertRuntimeMessagePacket(value: Packet<unknown>): asserts value is RuntimeMessagePacket<unknown> {
    if (!isRuntimeMessagePacket(value)) {
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

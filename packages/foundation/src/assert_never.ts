class UnreachableError extends Error {
    constructor(message: string) {
        super(message);
        this.name = new.target.name;
    }
}

export function assertUnreachable(_value: never): never {
    throw new UnreachableError('expected unreachable to here!');
}

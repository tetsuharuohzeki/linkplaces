export class AssertionError extends Error {
    constructor(msg: string) {
        super(`assert: ${msg}`);
        this.name = new.target.name;
    }
}

export function ok(condition: boolean, message: string): asserts condition is true {
    if (!condition) {
        throw new AssertionError(message);
    }
}

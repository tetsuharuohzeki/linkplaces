export class InfiniteIterator implements Iterator<string, unknown>, Iterable<string> {
    private _val: string;
    constructor(val: string) {
        this._val = val;
    }

    next(): IteratorResult<string> {
        return {
            done: false,
            value: this._val,
        };
    }

    return(): IteratorReturnResult<undefined> {
        return {
            done: true,
            value: undefined,
        };
    }

    [Symbol.iterator](): Iterator<string, unknown> {
        return this;
    }
}

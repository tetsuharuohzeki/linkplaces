export class UnsubscriptionError extends Error {
    readonly errors: Array<unknown>;
    constructor(errors: Array<unknown>) {
        super();
        this.name = new.target.name;
        this.errors = errors;
    }
}

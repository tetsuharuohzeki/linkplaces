export class NoImplementationError extends Error {
    constructor(msg: string) {
        super(`${msg} is not implemented`);
        this.name = new.target.name;
    }
}

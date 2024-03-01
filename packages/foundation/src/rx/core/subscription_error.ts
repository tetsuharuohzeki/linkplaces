export class SubscriptionError extends Error {
    constructor(message: string, cause?: unknown) {
        super(message, {
            cause,
        });
        this.name = new.target.name;
    }
}

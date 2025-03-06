export class SubscriptionError extends Error {
    constructor(message: string, cause?: unknown) {
        super(message, {
            cause,
        });
        this.name = new.target.name;
    }
}

export class SubscriptionCompleteByFailureError extends SubscriptionError {
    constructor(cause: unknown) {
        super('The factory throws something and the subscription is stopped', cause);
    }
}

import { isNotNull, unwrapNullable, type Nullable } from 'option-t/esm/Nullable';

import type { Unsubscribable } from './subscribable.js';
import type { TeardownFn } from './subscriber.js';
import { UnsubscriptionError } from './unsubscription_error.js';

export class Subscription implements Unsubscribable {
    private _aborter: AbortController;
    private _closed: boolean;
    private _finalizers: Nullable<Set<Unsubscribable>>;
    private _initialTeardown: Nullable<TeardownFn>;

    constructor(initialTeardown: Nullable<TeardownFn>) {
        this._aborter = new AbortController();
        this._closed = false;
        this._finalizers = null;
        this._initialTeardown = initialTeardown;
    }

    get signal(): AbortSignal {
        return this._aborter.signal;
    }

    get closed(): boolean {
        return this._closed;
    }

    unsubscribe(): void {
        const errors: Array<unknown> = [];
        if (!this._closed) {
            this._closed = true;

            const initialFinalizer = this._initialTeardown;
            if (isNotNull(initialFinalizer)) {
                try {
                    initialFinalizer();
                } catch (e) {
                    if (e instanceof UnsubscriptionError) {
                        errors.push(...e.errors);
                    } else {
                        errors.push(e);
                    }
                }
            }

            const finalizers = this._finalizers;
            if (isNotNull(finalizers)) {
                this._finalizers = null;
                for (const finalizer of finalizers) {
                    try {
                        finalizer.unsubscribe();
                    } catch (err) {
                        if (err instanceof UnsubscriptionError) {
                            errors.push(...err.errors);
                        } else {
                            errors.push(err);
                        }
                    }
                }
            }

            if (errors.length > 0) {
                throw new UnsubscriptionError(errors);
            }

            this._aborter.abort();
        }
    }

    add(teardown: Unsubscribable): void {
        if (teardown === this) {
            return;
        }

        if (this._closed) {
            teardown.unsubscribe();
        } else {
            this._finalizers ??= new Set();
            const finalizers = unwrapNullable(this._finalizers);
            finalizers.add(teardown);
        }
    }

    remove(teardown: Unsubscribable): void {
        const finalizers = unwrapNullable(this._finalizers);
        finalizers.delete(teardown);
    }
}

import { createErr, createOk, type Ok, type Result } from 'option-t/plain_result';

export type CompletionResult = Result<void, unknown>;

export function createCompletionOk(): Ok<void> {
    return createOk(undefined);
}

export const createCompletionErr: typeof createErr<unknown> = createErr<unknown>;

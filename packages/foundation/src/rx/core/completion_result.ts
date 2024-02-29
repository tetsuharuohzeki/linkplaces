import { createErr, createOk, type Ok, type Result } from 'option-t/esm/PlainResult';

export type CompletionResult = Result<void, unknown>;

export function createCompletionOk(): Ok<void> {
    return createOk(undefined);
}

export const createCompletionErr = createErr<unknown>;

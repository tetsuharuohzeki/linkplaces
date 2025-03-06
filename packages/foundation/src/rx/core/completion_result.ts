import type { Nullable } from 'option-t/nullable';

// XXX:
// We use this only on calling `.complete()` now, thus:
//
//  1. We don't pass an arbitrary sucess value.
//  2. We don't pass an arbitrary error value that is not `Error` instance.
//
//  By these reasons, we stopped to use _result_ type here.
export type CompletionResult = Nullable<Error>;

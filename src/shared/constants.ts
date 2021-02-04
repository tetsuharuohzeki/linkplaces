/* global process:readable */

// this will be embedded by the linker.
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion, dot-notation
export const GIT_REVISION: string = process.env['GIT_REVISION']!;

// this will be embedded by the linker.
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion, dot-notation
export const BUILD_DATE: string = process.env['BUILD_DATE']!;

// this will be embedded by the linker.
// eslint-disable-next-line dot-notation
export const USE_REACT_CONCURRENT_MODE: boolean = !!process.env['USE_REACT_CONCURRENT_MODE'];

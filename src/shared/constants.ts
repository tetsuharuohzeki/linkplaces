/* global process:readable */

// this will be embedded by the linker.
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const GIT_REVISION: string = process.env.GIT_REVISION!;

// this will be embedded by the linker.
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const BUILD_DATE: string = process.env.BUILD_DATE!;

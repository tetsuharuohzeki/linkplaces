// this will be embedded by the linker.
// tslint:disable-next-line:no-non-null-assertion
export const GIT_REVISION: string = process.env.GIT_REVISION!;

// this will be embedded by the linker.
// tslint:disable-next-line:no-non-null-assertion
export const BUILD_DATE: string = process.env.BUILD_DATE!;

// this will be embedded by the linker.
export const USE_WEB_COMPONENT: boolean = process.env.USE_WEB_COMPONENT === 'true';

/* eslint-disable @typescript-eslint/naming-convention */
/* global __COMPILE_TIME_EMBEDDED_CONSTANTS__:readonly */

declare global {
    interface CompileTimeEmbeddedConstants {
        readonly GIT_REVISION: string;
        readonly BUILD_DATE: string;
        readonly RELEASE_CHANNEL: string;
        readonly ENABLE_MV3: boolean;
        readonly USE_EVENT_PAGE_WORKAROUND: boolean;
    }

    // this will be embedded by the linker.
    // eslint-disable-next-line no-underscore-dangle
    const __COMPILE_TIME_EMBEDDED_CONSTANTS__: CompileTimeEmbeddedConstants;
}

export const GIT_REVISION: string = __COMPILE_TIME_EMBEDDED_CONSTANTS__.GIT_REVISION;

export const BUILD_DATE: string = __COMPILE_TIME_EMBEDDED_CONSTANTS__.BUILD_DATE;

export const RELEASE_CHANNEL = __COMPILE_TIME_EMBEDDED_CONSTANTS__.RELEASE_CHANNEL;

export const ENABLE_MV3 = __COMPILE_TIME_EMBEDDED_CONSTANTS__.ENABLE_MV3;
export const USE_EVENT_PAGE_WORKAROUND = __COMPILE_TIME_EMBEDDED_CONSTANTS__.USE_EVENT_PAGE_WORKAROUND;

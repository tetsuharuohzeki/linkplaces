/* eslint-disable @typescript-eslint/naming-convention */
/* global __COMPILE_TIME_EMBEDDED_CONSTANTS__:readonly */

declare global {
    interface CompileTimeEmbeddedConstants {
        readonly GIT_REVISION: string;
        readonly BUILD_DATE: string;
        readonly USE_REACT_CONCURRENT_MODE: boolean;
        readonly RELEASE_CHANNEL: string;
    }

    // this will be embedded by the linker.
    // eslint-disable-next-line no-underscore-dangle
    const __COMPILE_TIME_EMBEDDED_CONSTANTS__: CompileTimeEmbeddedConstants;
}

export const GIT_REVISION: string = __COMPILE_TIME_EMBEDDED_CONSTANTS__.GIT_REVISION;

export const BUILD_DATE: string = __COMPILE_TIME_EMBEDDED_CONSTANTS__.BUILD_DATE;

export const USE_REACT_CONCURRENT_MODE: boolean = __COMPILE_TIME_EMBEDDED_CONSTANTS__.USE_REACT_CONCURRENT_MODE;

export const RELEASE_CHANNEL = __COMPILE_TIME_EMBEDDED_CONSTANTS__.RELEASE_CHANNEL;

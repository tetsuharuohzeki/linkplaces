import * as assert from 'node:assert/strict';

import { mapOrForMaybe, mapForMaybe } from 'option-t/maybe';

const GIT_REVISION = mapOrForMaybe(process.env.GIT_REVISION, 'unknown', String);
const BUILD_DATE = mapOrForMaybe(process.env.BUILD_DATE, 'unknown', String);

const RELEASE_CHANNEL_VALUE_PRODUCTION = 'production';
const RELEASE_CHANNEL_VALUE_DEVELOPMENT = 'development';

const RELEASE_CHANNEL = mapOrForMaybe(process.env.RELEASE_CHANNEL, 'production', String);
const LIB_NODE_ENV =
    RELEASE_CHANNEL === 'production' ? RELEASE_CHANNEL_VALUE_PRODUCTION : RELEASE_CHANNEL_VALUE_DEVELOPMENT;

const IS_PRODUCTION_MODE = RELEASE_CHANNEL === RELEASE_CHANNEL_VALUE_PRODUCTION;
const IS_DEVELOPMENT_MODE = RELEASE_CHANNEL === RELEASE_CHANNEL_VALUE_DEVELOPMENT;

const SHOULD_FORCE_ENABLE_SOURCE_MAP = process.env.FORCE_ENABLE_SOURCE_MAP === 'true';
const ENABLE_SOURCE_MAP = SHOULD_FORCE_ENABLE_SOURCE_MAP || !IS_PRODUCTION_MODE;

const ENABLE_SWC_REACT_TRANSFORM = process.env.ENABLE_SWC_REACT_TRANSFORM !== 'false';
const ENABLE_REACT_COMPILER = mapForMaybe(process.env.ENABLE_REACT_PROFILER, (val) => {
    if (IS_DEVELOPMENT_MODE) {
        // make debugging easier
        return false;
    }

    assert.ok(IS_PRODUCTION_MODE, `ENABLE_REACT_COMPILER is configurable only in the production build`);
    const enabled = val === 'false';
    return enabled;
});

const ENABLE_REACT_PROFILER = mapOrForMaybe(process.env.ENABLE_REACT_PROFILER, false, (val) => {
    assert.ok(IS_PRODUCTION_MODE, `ENABLE_REACT_PROFILER is only enabled in the production build`);
    const enabled = val === 'true';
    return enabled;
});

export {
    GIT_REVISION,
    BUILD_DATE,
    RELEASE_CHANNEL,
    LIB_NODE_ENV,
    IS_PRODUCTION_MODE,
    ENABLE_SOURCE_MAP,
    ENABLE_REACT_PROFILER,
    ENABLE_SWC_REACT_TRANSFORM,
    ENABLE_REACT_COMPILER,
};

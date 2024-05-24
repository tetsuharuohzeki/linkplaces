import * as assert from 'node:assert/strict';

import { mapOrForMaybe } from 'option-t/Maybe';

const GIT_REVISION = mapOrForMaybe(process.env.GIT_REVISION, 'unknown', String);
const BUILD_DATE = mapOrForMaybe(process.env.BUILD_DATE, 'unknown', String);

const RELEASE_CHANNEL = mapOrForMaybe(process.env.RELEASE_CHANNEL, 'production', String);
const LIB_NODE_ENV = RELEASE_CHANNEL === 'production' ? 'production' : 'development';
const IS_PRODUCTION_MODE = RELEASE_CHANNEL === 'production';

const SHOULD_FORCE_ENABLE_SOURCE_MAP = process.env.FORCE_ENABLE_SOURCE_MAP === 'true';
const ENABLE_SOURCE_MAP = SHOULD_FORCE_ENABLE_SOURCE_MAP || !IS_PRODUCTION_MODE;

const ENABLE_SWC_REACT_TRANSFORM = process.env.ENABLE_SWC_REACT_TRANSFORM !== 'false';
const ENABLE_REACT_COMPILER = process.env.ENABLE_REACT_COMPILER !== 'false';

const ENABLE_REACT_PROFILER = mapOrForMaybe(process.env.ENABLE_REACT_PROFILER, false, (val) => {
    assert.ok(IS_PRODUCTION_MODE, `ENABLE_REACT_PROFILER is only enabled in the production build`);
    const enabled = val === 'true';
    return enabled;
});

const ENABLE_MV3 = true;

export {
    GIT_REVISION,
    BUILD_DATE,
    RELEASE_CHANNEL,
    LIB_NODE_ENV,
    IS_PRODUCTION_MODE,
    ENABLE_SOURCE_MAP,
    ENABLE_REACT_PROFILER,
    ENABLE_MV3,
    ENABLE_SWC_REACT_TRANSFORM,
    ENABLE_REACT_COMPILER,
};

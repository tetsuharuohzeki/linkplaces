import * as assert from 'node:assert/strict';

import * as MaybeMod from 'option-t/esm/Maybe';

const GIT_REVISION = MaybeMod.mapOr(process.env.GIT_REVISION, 'unknown', String);
const BUILD_DATE = MaybeMod.mapOr(process.env.BUILD_DATE, 'unknown', String);

const RELEASE_CHANNEL = MaybeMod.mapOr(process.env.RELEASE_CHANNEL, 'production', String);
const LIB_NODE_ENV = (RELEASE_CHANNEL === 'production') ? 'production' : 'development';
const IS_PRODUCTION_MODE = (RELEASE_CHANNEL === 'production');

const ENABLE_SOURCE_MAP = !IS_PRODUCTION_MODE;

const ENABLE_REACT_PROFILER = MaybeMod.mapOr(process.env.ENABLE_REACT_PROFILER, false, (val) => {
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
};

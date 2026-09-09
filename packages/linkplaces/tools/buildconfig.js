import * as assert from 'node:assert/strict';

import { MaybeOperator } from 'option-t/maybe';

const GIT_REVISION = MaybeOperator.mapOr(process.env.GIT_REVISION, 'unknown', String);
const BUILD_DATE = MaybeOperator.mapOr(process.env.BUILD_DATE, 'unknown', String);

const RELEASE_CHANNEL_VALUE_PRODUCTION = 'production';
const RELEASE_CHANNEL_VALUE_DEVELOPMENT = 'development';

export const NODE_ENV = process.env.NODE_ENV;

const RELEASE_CHANNEL = MaybeOperator.mapOr(process.env.RELEASE_CHANNEL, 'production', String);
const LIB_NODE_ENV =
    RELEASE_CHANNEL === 'production' ? RELEASE_CHANNEL_VALUE_PRODUCTION : RELEASE_CHANNEL_VALUE_DEVELOPMENT;

// https://github.com/rollup/plugins/pull/1823
export const LIB_NODE_ENV_IS_NOT_PRODUCTION = RELEASE_CHANNEL !== 'production';

const IS_PRODUCTION_MODE = RELEASE_CHANNEL === RELEASE_CHANNEL_VALUE_PRODUCTION;
const IS_DEVELOPMENT_MODE = RELEASE_CHANNEL === RELEASE_CHANNEL_VALUE_DEVELOPMENT;

const SHOULD_FORCE_ENABLE_SOURCE_MAP = process.env.FORCE_ENABLE_SOURCE_MAP === 'true';
const ENABLE_SOURCE_MAP = SHOULD_FORCE_ENABLE_SOURCE_MAP || !IS_PRODUCTION_MODE;

const ENABLE_REACT_COMPILER = MaybeOperator.mapOrElse(
    process.env.ENABLE_REACT_COMPILER,
    () => {
        if (IS_DEVELOPMENT_MODE) {
            // make debugging easier
            return false;
        }
        return true;
    },
    (val) => {
        assert.ok(IS_PRODUCTION_MODE, `ENABLE_REACT_COMPILER is configurable only in the production build`);
        const enabled = val === 'true';
        return enabled;
    }
);

const ENABLE_REACT_PROFILER = MaybeOperator.mapOr(process.env.ENABLE_REACT_PROFILER, false, (val) => {
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
    ENABLE_REACT_COMPILER,
};

export const FILE_PATTERN_CSS = ['**/*.css'];
export const FILE_PATTERN_JS_ESM = ['**/*.mjs', '**/*.js'];
export const FILE_PATTERN_JS_CJS = ['**/*.cjs'];
export const FILE_PATTERN_TS = ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'];
export const FILE_PATTERNS_ALL_JS_AND_TS = Array.from(
    new Set([...FILE_PATTERN_JS_ESM, ...FILE_PATTERN_JS_CJS, ...FILE_PATTERN_TS])
);

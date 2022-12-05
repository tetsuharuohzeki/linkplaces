import presets from 'eslint-config-prettier';
import userConfig from '../prettier.cjs';

export const config = Object.freeze({
    rules: {
        ...presets.rules,
        ...userConfig.rules,
    },
});

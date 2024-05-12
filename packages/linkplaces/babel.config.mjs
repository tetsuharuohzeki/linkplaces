import { IS_PRODUCTION_MODE } from './tools/buildconfig.js';

// eslint-disable-next-line import/no-anonymous-default-export,import/no-default-export
export default {
    presets: [
        [
            '@babel/preset-react',
            {
                // https://github.com/babel/babel/tree/master/packages/babel-preset-react#options
                development: !IS_PRODUCTION_MODE,
                useSpread: true,
                runtime: 'automatic',
            },
        ],
    ],
    plugins: [],
};

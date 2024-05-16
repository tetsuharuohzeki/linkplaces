import { IS_PRODUCTION_MODE, ENABLE_REACT_COMPILER } from './buildconfig.js';

const REACT_COMPILER_CONFIG = {};

const plugins = ENABLE_REACT_COMPILER
    ? [
          // @prettier-ignore
          ['babel-plugin-react-compiler', REACT_COMPILER_CONFIG],
      ]
    : [];

const presets = [
    [
        '@babel/preset-react',
        {
            // https://github.com/babel/babel/tree/master/packages/babel-preset-react#options
            development: !IS_PRODUCTION_MODE,
            useSpread: true,
            runtime: 'automatic',
        },
    ],
];

export const cliConfig = {
    presets,
    plugins,
};

export const rollupConfig = {
    presets,
    plugins,
};

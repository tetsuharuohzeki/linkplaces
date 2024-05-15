import { IS_PRODUCTION_MODE, ENABLE_REACT_COMPILER } from './tools/buildconfig.js';

const REACT_COMPILER_CONFIG = {};

const plugins = ENABLE_REACT_COMPILER
    ? [
          //
          ['babel-plugin-react-compiler', REACT_COMPILER_CONFIG],
      ]
    : [];

// This is used from babel cli.
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
    plugins,
};

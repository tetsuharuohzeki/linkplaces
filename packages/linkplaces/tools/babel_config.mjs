import { IS_PRODUCTION_MODE, ENABLE_REACT_COMPILER, ENABLE_SWC_REACT_TRANSFORM } from './buildconfig.js';

const REACT_COMPILER_CONFIG = {};

const plugins = ENABLE_REACT_COMPILER
    ? [
          // @prettier-ignore
          ['babel-plugin-react-compiler', REACT_COMPILER_CONFIG],
          // This is required to parse jsx syntax.
          // react compiler is required to place to the first.
          // So other transformer have not transformed jsx yet.
          ['@babel/plugin-syntax-jsx'],
      ]
    : [];

export const cliConfig = {
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

export const rollupConfig = {
    presets: ENABLE_SWC_REACT_TRANSFORM
        ? []
        : [
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

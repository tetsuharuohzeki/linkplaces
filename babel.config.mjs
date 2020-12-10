import buildconfigMod from './tools/buildconfig.cjs';

const {
    IS_PRODUCTION_MODE,
} = buildconfigMod;

// eslint-disable-next-line import/no-anonymous-default-export,import/no-default-export
export default {
    presets: [
        ['@babel/preset-react', {
            // https://github.com/babel/babel/tree/master/packages/babel-preset-react#options
            development: !IS_PRODUCTION_MODE,
            useSpread: true,
            runtime: 'automatic',
        }],
    ],
    plugins: [
    ],
};

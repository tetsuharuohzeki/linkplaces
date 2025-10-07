// eslint-disable-next-line import/no-default-export
export default function resolveAvaConfig() {
    return {
        files: ['**/__tests__/**/*.test.{js,cjs,mjs,ts,tsx,cts,mts}'],
        typescript: {
            rewritePaths: {
                'src/': '__dist/',
            },
            compile: false,
        },
    };
}

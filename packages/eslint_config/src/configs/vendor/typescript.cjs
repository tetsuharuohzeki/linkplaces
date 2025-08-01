// Copied from https://github.com/cats-oss/eslint-config-abema/blob/72a943d6271704c5e87cf22d803f409a735398b7/config/eslintrc_typescript.js

'use strict';

module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],

    rules: {
        // Basically, it's nice to uniform the order of overload signatures.
        '@typescript-eslint/adjacent-overload-signatures': 'warn',

        // TypeScript allows both forms of `[]` and `Array<T>`.
        // But typescript compiler also supports `ReadonlyArray<T>` builtin type and others.
        // So I seem it's nice to sort with `Array<T>` to decrease impedance mismatch.
        '@typescript-eslint/array-type': [
            'warn',
            {
                default: 'generic',
            },
        ],

        // If you don't have use `await`, then it should be removed to reduce internal works.
        '@typescript-eslint/await-thenable': 'warn',

        // At almost case, ts-blahblah comment is explicit and it works well as an escape hatch.
        '@typescript-eslint/ban-ts-comment': [
            'error',
            {
                'ts-expect-error': false,
                // `@ts-ignore` violates all static type checkings for _all expressions_ in the next line.
                // It will not be too much warn about it.
                'ts-ignore': true,
                'ts-nocheck': false,
                'ts-check': false,
            },
        ],

        // Uniform the style.
        '@typescript-eslint/consistent-type-assertions': [
            'warn',
            {
                // Sort the style in both of ts and tsx.
                assertionStyle: 'as',
                // `const` assertion is ignored by this rule.
                // I think it's better to sort the type assertion style.
                objectLiteralTypeAssertions: 'never',
            },
        ],

        // Each style has its own pros & cons.
        '@typescript-eslint/consistent-type-definitions': 'off',

        // TODO: (#64) @typescript-eslint/explicit-function-return-type

        // It's redundant to enforce to supply `public`.
        '@typescript-eslint/explicit-member-accessibility': [
            'warn',
            {
                accessibility: 'no-public',
                // 'ignoredMethodNames': [],
                overrides: {
                    // Fro parameter properties, all items should be explicited.
                    parameterProperties: 'explicit',
                },
            },
        ],

        // TODO: #301
        '@typescript-eslint/explicit-module-boundary-types': 'off',

        // I don't think it's not efffective to sort the order by public/private/protected.
        '@typescript-eslint/member-ordering': [
            'warn',
            {
                // * I'd like to aggregate instance fields
                //   to know what we should initialize in the constructor to stabilize the object shape.
                // * It's the time to refactor the object if we'd like to mix the order of static fields & methods.
                default: [
                    'signature',
                    'static-field',
                    'static-method',
                    'instance-field',
                    'constructor',
                    'instance-method',
                ],
            },
        ],

        // In a general case, we don't have to do this.
        // This kind of `delete` operation causes an unnecessary shape transition.
        // This _shape_ means Shape (SpiderMonkey), Hidden Class (V8), or Structure (JSC).
        '@typescript-eslint/no-dynamic-delete': 'error',

        // It works as a marker that to implement some interfaces.
        '@typescript-eslint/no-empty-interface': 'off',

        // Please opt-out this rule if you don't have any workarounds.
        '@typescript-eslint/no-explicit-any': [
            'warn',
            {
                // Even if rest arguments, we should mark them explicitly.
                ignoreRestArgs: false,
            },
        ],

        '@typescript-eslint/no-extraneous-class': [
            'warn',
            {
                allowConstructorOnly: true,
                allowEmpty: true,
                // If there is the class which only have static members,
                // then we have a chance to refactoring them to simple module level variables.
                allowStaticOnly: false,
                // TypeScript decorator is still not standardized. We should not touch it.
                // allowWithDecorator
            },
        ],

        // Detect redundant code
        '@typescript-eslint/no-extra-non-null-assertion': 'warn',

        // Of course, this might be redundant if you set unhandledrejection event handler.
        // We still have some points which should be under discussion. See: #135
        '@typescript-eslint/no-floating-promises': [
            'warn',
            {
                // Promise might reject even if the its returned value is `void`.
                ignoreVoid: false,
            },
        ],

        // This is common pitfalls for beginners. We must ban.
        '@typescript-eslint/no-for-in-array': 'error',

        // Basically, we should ban this kind of idioms.
        // However, if you need to use `new Function`, then you can opt-out this rule.
        '@typescript-eslint/no-implied-eval': 'error',

        // Type inference is useful feature for Gradual Typing and other static typing system.
        // However, over omission would increases compile (type checking) time and
        // lacks the aspect of type annotation benefits as _documentation_.
        '@typescript-eslint/no-inferrable-types': 'off',

        // This should be sorted with ESLint builtin rule.
        'no-magic-numbers': 'off',
        '@typescript-eslint/no-magic-numbers': [
            'warn',
            {
                // Allow these values which are used commonly in test, flags, or others.
                ignore: [0, 1],

                // Even if we use magic number, it would not be difficult for type & enum...
                ignoreNumericLiteralTypes: true,
                ignoreReadonlyClassProperties: false, // there is no difference with the case of normal const var.
                ignoreEnums: true,
            },
        ],

        // Ban the misused style aggressively
        '@typescript-eslint/no-misused-new': 'error',

        '@typescript-eslint/no-misused-promises': [
            'warn',
            {
                // It's nice to detect the part which we expect to use a boolean value.
                checksConditionals: true,
                // We disable this option to allow `await` for event handler callbacks.
                checksVoidReturn: false,
            },
        ],

        // Only allow declarations. Use ES Module in almost projects.
        '@typescript-eslint/no-namespace': [
            'error',
            {
                allowDeclarations: true,
                allowDefinitionFiles: true,
            },
        ],

        // Ban this pattern to keep type safety
        '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',

        // Please opt-out this rule if you don't have any workarounds.
        '@typescript-eslint/no-non-null-assertion': 'warn',

        // Today, we should use ES Module import in general (almost) case.
        '@typescript-eslint/no-require-imports': 'error',

        // Use arrow function basically.
        '@typescript-eslint/no-this-alias': [
            'warn',
            {
                allowDestructuring: false,
                allowedNames: ['self'],
            },
        ],

        // Disabling this does not make sense completely.
        '@typescript-eslint/no-type-alias': 'off',

        // For self-evident case, we don't have to write to compare.
        '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'warn',

        // This would find the possibility which we can unnecessary condition.
        '@typescript-eslint/no-unnecessary-condition': [
            'warn',
            {
                allowConstantLoopConditions: true,
            },
        ],

        // Try to detect redundant case,
        '@typescript-eslint/no-unnecessary-qualifier': 'warn',

        // It's bad to force to skip to specify.
        '@typescript-eslint/no-unnecessary-type-arguments': 'off',

        // We allow this this kind of redundant code because it sometimes prevents a mistake.
        '@typescript-eslint/no-unnecessary-type-assertion': 'off',

        // I think this rule is useful.
        // But I'm not sure about that the relation with `noImplicitAny` compiler option.
        // FIXME(#257)
        '@typescript-eslint/no-untyped-public-signature': 'off',

        // This should be sorted with ESLint builtin rule.
        //
        // If your project only has TypeScript or you run ESLint for TypeScript separately from for JavaScript,
        // and if you use typescript compiler with `noUnused***` options,
        // then you can disable this.
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [
            'warn',
            {
                vars: 'all',
                args: 'after-used',
                argsIgnorePattern: '^_', // Sort with TypeScript compiler's builtin linter.
                caughtErrors: 'all',
                caughtErrorsIgnorePattern: '^_', // Allow `catch (_e) {...}`
            },
        ],
        // Ideally, we should use this rule instead of it for TypeScript code
        // '@typescript-eslint/no-unused-vars-experimental': ['warn', {
        //    'ignoredNamesRegex': '^_',
        //    'ignoreArgsIfArgsAfterAreUsed': false,
        // }],

        // I think this rule should be enabled.
        '@typescript-eslint/prefer-as-const': 'warn',

        //  We should not enable this restrictions.
        //  See:
        //      - https://wikipedia.org/wiki/Open/closed_principle
        //      - https://github.com/microsoft/TypeScript/wiki/Performance#preferring-interfaces-over-intersections
        //      - https://www.typescriptlang.org/docs/handbook/advanced-types.html#interfaces-vs-type-aliases
        '@typescript-eslint/prefer-function-type': 'off',

        // Today, in almost case, we don't have to write `for` loop because native implementations which supports
        // iterator protocols or you might use some down-level transformers. So I think we should enable this rule.
        //
        // If your application cannot use any down-level transformers or if you face to some perf issue,
        // let's disable this.
        // If you would like to ban `for-of` loop by that the transformed code is large,
        // then it might be more better to ban `for-of` syntax.
        //
        // TODO(#97):
        // However, by the implementation of this rule v1.7,
        // this mis-reports the error even if the collection in for loop does not have Symbol.iterator().
        '@typescript-eslint/prefer-for-of': 'off',

        // Today, in almost case, we would develop our application with ES2016~ polyfills
        // and it's rare case to develop an app without ~ES2016 polyfills.
        // So I think we should enable this rule.
        // If your application cannot load any polyfills or have any perf issues,
        // let's disable this.
        // By the implementation of this rule in v1.7, this rule detects if the object fulfills:
        //
        //  * Has `indexOf()` property.
        //  * Has `includes()` property.
        //  * They has same signatures.
        '@typescript-eslint/prefer-includes': 'warn',

        // This bans legacy syntax.
        '@typescript-eslint/prefer-namespace-keyword': 'error',

        // Recommend more simple syntax.
        // XXX: However, without native support, this syntax might be code bloat.
        '@typescript-eslint/prefer-nullish-coalescing': 'warn',

        // Recommend more simple syntax.
        // XXX: However, without native support, this syntax might be code bloat.
        '@typescript-eslint/prefer-optional-chain': 'warn',

        // This rule is nice for refactoring, but I suspect to enable this at all time.
        // This only covers `private` property and I don't think that it's pretty useful
        // to warn private properties' unnecessary mutability.
        // I suspect it's noisy. Their properties is closed
        // and their mutability would not be a complex problem in almost case.
        '@typescript-eslint/prefer-readonly': 'off',

        // * We enable this rule to sorting the style in your project.
        // * I'm not sure about that this rule document says as the reason that `RegExp.prototype.exec()` is faster than
        //  `String.prototype.match()`. We need to invetigate it as future work. See #117.
        // * This rule might not cover the case that fulfills these conditions:
        //      1.  `somestring.match(regexp)` and this `regexp` is a simple arguments which is annotated with `RegExp`
        //          of function _A_.
        //      2.  function _A_ would be take both of a regular expression with `g` flag and one without `g` flag.
        //   But I think that such case has some potential bugs
        //   because `String.prototype.match()` works in a different wary by supplying `g` flag.
        // We should elminate such code.
        '@typescript-eslint/prefer-regexp-exec': 'warn',

        // Today, in almost case, we would develop our application with ES2015~ polyfills
        // and it's rare case to develop an app without ~ES2015 polyfills.
        // So I think we should enable this rule.
        // If your application cannot load any polyfills or have any perf issues,
        // let's disable this.
        '@typescript-eslint/prefer-string-starts-ends-with': 'warn',

        // Of course, It looks nice for styling to sort them
        // to async function that all functions returning `Promise`.
        // However, we hesitate to say some policy about it by these reasons
        // and we stay disable this rule.
        //
        //  1. We don't have much data about the performance impact of
        //     "async function vs returning `Promise`".
        //  2. In almost case, it bloats the result code size by down-level transform for async function.
        //     even if it simply return the value wrapped in `Promise` and without any `await` clause.
        //     if is not always nice to use `async function()`.
        //  3. We can annotate the type of returned value and we also checking types statically,
        //     thus we don't have strong motivation to use `async function ()` syntax as signature.
        //
        // For the future, we might be enable this. But this moment is not so.
        '@typescript-eslint/promise-function-async': 'off',

        // We should sort with builtin rule.
        'require-await': 'off',
        '@typescript-eslint/require-await': 'off',

        // This detects a common mistake which uses `+` for diffrent types.
        '@typescript-eslint/restrict-plus-operands': [
            'warn',
            {
                skipCompoundAssignments: true,
            },
        ],

        // I think it's error prone to implicit string conversion.
        // But I also think this might be a noisy. It might be better to disable this for the future.
        '@typescript-eslint/restrict-template-expressions': [
            'warn',
            {
                allowNumber: false,
                allowBoolean: false,
                allowNullish: false,
            },
        ],

        // FIXME: #272
        // '@typescript-eslint/return-await'

        // At v1.12, this rule does not support the idion to convert to boolean value from other type one
        // like `!!<some non boolean value>`. So we disable this until fixing it.
        // FIXME: #152
        '@typescript-eslint/strict-boolean-expressions': 'off',

        // This is nice to work with union.
        '@typescript-eslint/switch-exhaustiveness-check': 'error',

        // Basically, use ES Module import. // <reference path="" /> is just special case.
        '@typescript-eslint/triple-slash-reference': [
            'error',
            {
                path: 'never',
                types: 'never',
                lib: 'never',
            },
        ],

        // TODO: @typescript-eslint/typedef

        // In some case, function definition by overloading improves IntelliSense ergonomics.
        '@typescript-eslint/unified-signature': 'off',
    },
};

import corePresets from './vendor/core.cjs';

const builtinRules = Object.freeze({
    // In JavaScript, after ES Module or CommonJS era (single module per single file),
    // excluding the case to improve an API ergonomics or requirement to implement an object interface,
    // we don't have to belong a function that does not touch `this` to a class unlike Java or C++.
    // We should not do such a thing.
    //
    // This rule bans a class instance method
    // that does not touch any `this` to improve a possibility to minify a code.
    //
    // Additionally, it's hard to minify a property that is on prototype chain.
    // Typically, they appears as a pattern as class' instance method.
    // We cannot remove or mangle a code like `a.foo()` style code
    // without analysis for whole of programs including usages of reflection
    // or identifying what item is a part of public interface.
    //
    // To get a chance to improve a code size performance and to simplify a code,
    // it's better that we should export a standalone function directly
    // instead of a part of class if it does not affect an API ergonomics.
    'class-methods-use-this': [
        'warn',
        {
            enforceForClassFields: true,
            // We would like to allow override the base method on super class.
            ignoreOverrideMethods: true,
            // We would like to allow to implement an empty method as a part of the interface.
            ignoreClassesWithImplements: 'public-fields',
        },
    ],

    // In almost case, we don't have to use it.
    'no-array-constructor': 'error',

    // This prevents the pattern that is error prone.
    'no-constant-binary-expression': 'error',

    'no-dupe-class-members': 'error',

    // Allow to cast to boolean with `!!bar`. This is common idiom.
    'no-extra-boolean-cast': 'off',

    // This prevents the runtime error.
    'no-new-native-nonconstructor': 'error',

    // We should not use it by the reason described in https://eslint.org/docs/latest/rules/no-object-constructor
    'no-object-constructor': 'warn',

    // Warn a variable that don't be non `undefined` value.
    'no-unassigned-vars': 'warn',

    // It should be removed.
    'no-unused-expressions': 'error',

    // This detects unused field easily.
    'no-unused-private-class-members': 'warn',

    // We use custom config to make the behavior similar to TypeScript's unused var checker.
    'no-unused-vars': [
        // Not make an error for debugging.
        'warn',
        {
            vars: 'all',
            args: 'after-used',
            argsIgnorePattern: '^_', // Sort with TypeScript compiler's builtin linter.
            caughtErrors: 'all',
            caughtErrorsIgnorePattern: '^_', // Allow `catch (_e) {...}`
        },
    ],

    'no-use-before-define': [
        'error',
        {
            functions: false, //  Function declarations are hoisted.
            classes: true, // Class declarations are not hoisted. We should warn it.
            variables: true, // for Temporary Dead Zone.
            enums: true,
            typedefs: true, // We rely TypeScript compiler.
        },
    ],

    // Allow shorthand syntax.
    'no-useless-constructor': 'off',

    // Now, we don't have to use `var` generally.
    'no-var': 'warn',

    // This prevents the error at the running time.
    'valid-typeof': ['error', { requireStringLiterals: true }],
});

const projectSpecificRules = Object.freeze({
    'no-magic-numbers': 'off',

    'no-restricted-imports': [
        'error',
        {
            paths: [
                //
                'option-t/classic_option',
                'option-t/classic_result',
            ],
        },
    ],
});

/**
 *  @type   {import('eslint').Linter.FlatConfig}
 */
export const config = Object.freeze({
    rules: {
        ...corePresets.rules,
        ...builtinRules,
        ...projectSpecificRules,
    },
});

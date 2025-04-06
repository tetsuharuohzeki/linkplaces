/**
 *  @type   {import("eslint").Linter.RulesRecord}
 *  @see    https://typescript-eslint.io/rules/naming-convention/
 */
export const rules = {
    // This should be sorted with ESLint builtin rule.
    camelcase: 'off',
    '@typescript-eslint/naming-convention': [
        'warn',
        {
            selector: 'default',
            format: ['camelCase'],
            leadingUnderscore: 'allow',
        },

        {
            selector: 'variable',
            format: [
                'camelCase',
                'UPPER_CASE',
                // We need allow `PascalCase` for React component.
                // e.g.
                //  ```
                //  const SomeContext = React.useContext();
                //
                //  const MemoizedComponent = React.memo(function SomeComponent() {});
                //  ```
                'PascalCase',
            ],
        },

        {
            selector: 'function',
            // For React's Function Component, we need allow `PascalCase`.
            format: ['camelCase', 'PascalCase'],
        },

        {
            selector: 'parameter',
            format: ['camelCase'],
            leadingUnderscore: 'allow',
        },

        // Enforce that private members are prefixed with an underscore
        // By these reasons, I think we recommend to add `_` prefix to private fields.
        //
        //  * Historically, JavaScript wolrd use `_` prefix to mark fields as _private_.
        //  * Until coming [private fields of class field declarations proposal](https://github.com/tc39/proposal-class-fields),
        //    there is no true private fields in JavaScript.
        //      * If TypeScript compiler supports it, it might be better to relax this rule.
        //  * TypeScript will be transformed into plain JavaScript and plain JavaScript does not any informations
        //    to express whether a field is private or not.
        {
            selector: 'memberLike',
            modifiers: ['private', 'protected'],
            format: ['camelCase'],
            // FIXME: Does this option really work?
            // See #378
            leadingUnderscore: 'require',
        },
        {
            selector: 'enumMember',
            format: ['PascalCase'],
        },

        {
            selector: 'typeLike',
            format: ['PascalCase'],
        },
        // A class & interface should be PascalCased
        {
            selector: 'class',
            // Don't export to make it private.
            leadingUnderscore: 'forbid',
            format: ['PascalCase'],
        },

        // Enforce that interface names do not begin with an I
        // [By TypeScript coding guidelines](https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines),
        // This rule is banned.
        // > Do not use "I" as a prefix for interface names.
        // We follow this.
        {
            selector: 'interface',
            format: ['PascalCase'],
            // Don't export to make it private.
            leadingUnderscore: 'forbid',
            custom: {
                regex: '^I[A-Z]',
                match: false,
            },
        },

        //  * We accept the style for T , TA , TAbc , TA1Bca , T1 , T2.
        //      * You seem this style is similar to C# or typescript compiler.
        //      * This choise is for:
        //          * future readability
        //          * expressiveness
        //          * Our target is an application, not library.
        //          * Automate code review process and avoid the bike-shedding.
        //  * We don't allow the style for `R`, `K`, `V`, or other forms which we can see in Java or other many languages.
        //      * It's short but less information.
        {
            selector: 'typeParameter',
            format: ['PascalCase'],
            prefix: ['T'],
            // For more strictly, we should use this regexp, but I don't feel we don't have to do it now.
            //'custom': {
            //    'regex': '^T([A-Z0-9][a-zA-Z0-9]*){0,1}$',
            //    'match': true,
            //},
        },

        {
            selector: 'import',
            format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        },
    ],
};

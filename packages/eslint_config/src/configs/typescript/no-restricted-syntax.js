/**
 *  @type   {import("eslint").Linter.RulesRecord}
 */
export const rules = {
    'no-restricted-syntax': [
        'error',
        {
            // It's a just slow syntax. We don't have any reason to use it for production code.
            selector: 'PrivateIdentifier',
            message:
                "_private class field syntax_ is not allowed for the application code. Use TS' `private` modifier instead",
        },
    ],
};

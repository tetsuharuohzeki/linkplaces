// @ts-check
import * as assert from 'node:assert/strict';

import { createFilter } from '@rollup/pluginutils';
import { transform } from '@swc/core';

/**
 *  @import { FilterPattern } from '@rollup/pluginutils';
 *  @import { Options as SWCOptions } from '@swc/core';
 *  @import { Plugin } from 'rollup';
 */

/**
 *  @typedef {Object} FilterOption
 *  @property {FilterPattern=} include
 *  @property {FilterPattern=} exclude
 */

/**
 *  @param {SWCOptions} swcOptions
 *  @param  {FilterOption}  filterOptions
 *  @returns    {Plugin}
 */
export function swc(swcOptions, filterOptions) {
    assert.ok(!!swcOptions);
    assert.ok(!!filterOptions);

    const filter = createFilter(filterOptions.include, filterOptions.exclude);

    return {
        name: 'swc',
        async transform(code, id) {
            if (!filter(id)) {
                return null;
            }

            const transformed = await transform(code, {
                ...swcOptions,
                sourceMaps: true,
                filename: id,
            });
            return transformed;
        },
    };
}

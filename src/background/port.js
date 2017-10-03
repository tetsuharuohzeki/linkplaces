/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
// @ts-check

import { getLinkSchemeType } from './Bookmark';
import { createTab } from './TabOpener';
import { NoImplementationError } from '../shared/NoImplementationError';

/**
 *  @param {string} url
 *  @param {string} where
 *  @returns {Promise<number> | Promise<null>}
 */
export function openUrl(url, where) {
    const { isPrivileged } = getLinkSchemeType(url);
    let opened = null;
    if (isPrivileged) {
        const e = new NoImplementationError('opening a privileged url');
        opened = Promise.reject(e);
    }
    else {
        opened = createTab(url, where);
    }

    return opened;
}

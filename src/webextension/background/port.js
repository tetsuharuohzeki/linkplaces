/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
// @ts-check
import { getLinkSchemeType } from './Bookmark';
import { BrowserMessagePort } from './BrowserMessagePort';
import {
    MSG_TYPE_OPEN_URL,
    MSG_TYPE_OPEN_URL_RESULT,
} from './IpcMsg';
import { createTab, openBookmarklet } from './TabOpener';

/*eslint-env webextensions */
/* global console: false */

// @ts-ignore
export const gClassicRuntimePort = BrowserMessagePort.create(browser, async (msg /* :IpcMsg<{| where: string; url: string; |}> */,
    // @ts-ignore
    sender /* :webext$runtime$MessageSender & webext$runtime$Port */) => {
    const { type, id, value } = msg;
    switch (type) {
        case MSG_TYPE_OPEN_URL: {
            const { url, where } = value;
            try {
                const res = await onMessageCreateTab(id, url, where);
                sender.postMessage(res);
            }
            catch (e) {
                console.error(e);
            }
            break;
        }
    }
});

/**
 *  @param {number} msgId
 *  @param {string} url
 *  @param {string} where
 *  @returns {Promise<*>}
 */
async function onMessageCreateTab(msgId, url, where) {
    let value = null;
    try {
        const tabId = await openUrl(url, where);
        value = {
            ok: true,
            tabId: tabId,
            error: null,
        };
    }
    catch (e) {
        value = {
            ok: false,
            tabId: null,
            error: e.message,
        };
    }

    const response = {
        id: msgId,
        type: MSG_TYPE_OPEN_URL_RESULT,
        value,
    };

    return response;
}

/**
 *  @param {string} url
 *  @param {string} where
 *  @returns {Promise<number> | Promise<null>}
 */
export function openUrl(url, where) {
    const { isPrivileged, type } = getLinkSchemeType(url);
    let opened = null;
    if (isPrivileged) {
        if (type === 'javascript') {
            opened = openBookmarklet(url);
        }
        else {
            gClassicRuntimePort.postOneShotMessage('linkplaces-open-privileged-url', {
                url,
            });
            opened = Promise.resolve(null);
        }
    }
    else {
        opened = createTab(url, where);
    }

    return opened;
}

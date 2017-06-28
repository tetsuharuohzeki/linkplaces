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
async function onMessageCreateTab(msgId, url, where) /* :Promise<IpcMsg<{| ok: boolean; tabId: ?number; error: ?string; |} | null>> */ {
    const { isPrivileged, type } = getLinkSchemeType(url);
    if (isPrivileged && type !== 'javascript') {
        gClassicRuntimePort.postOneShotMessage('linkplaces-open-privileged-url', {
            url,
        });

        const response = {
            id: msgId,
            type: MSG_TYPE_OPEN_URL_RESULT,
            value: {
                ok: true,
                tabId: null,
                error: null,
            },
        };
        return response;
    }

    let value; // eslint-disable-line init-declarations
    try {
        let tabId; // eslint-disable-line init-declarations

        if (isPrivileged) {
            tabId = await openBookmarklet(url);
        }
        else {
            tabId = await createTab(url, where);
        }

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

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
// @ts-check

import {
    IPC_MSG_TYPE_OPEN_PRIVILEGED_URL,
    IPC_MSG_TYPE_OPEN_TAB,
    IPC_MSG_TYPE_OPEN_TAB_RESULT,
} from '../shared/OverIpcAction';

import { getLinkSchemeType } from './Bookmark';
import { BrowserMessagePort } from './BrowserMessagePort';
import { createTab } from './TabOpener';

/*eslint-env webextensions */
/* global console: false */

// @ts-ignore
export const gClassicRuntimePort = BrowserMessagePort.create(browser, async (msg /* :IpcMsg<{| where: string; url: string; |}> */,
    // @ts-ignore
    sender /* :webext$runtime$MessageSender & webext$runtime$Port */) => {
    const { type, id, value } = msg;
    switch (type) {
        case IPC_MSG_TYPE_OPEN_TAB: {
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
        type: IPC_MSG_TYPE_OPEN_TAB_RESULT,
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
            throw new EvalError('Linkplaces does not support `javascript:` scheme.');
        }
        else {
            gClassicRuntimePort.postOneShotMessage(IPC_MSG_TYPE_OPEN_PRIVILEGED_URL, {
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

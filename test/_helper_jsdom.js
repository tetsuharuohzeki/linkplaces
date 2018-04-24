'use strict';

const jsdom = require('jsdom');

const { JSDOM } = jsdom;

const HTML =
    `<!DOCTYPE html>
<html>
</html>
`;

const ORIGIN_URL = 'https://example.com/';

function createJsDomWindow() {
    const { window } = new JSDOM(HTML, {
        url: ORIGIN_URL,
        referrer: ORIGIN_URL,
        contentType: 'text/html',
    });
    return window;
}

const originalGlobal = global;

function replaceGlobalWithJsDom(win) {
    const winproxy = createWinProxy(win);
    originalGlobal.window = win;
    originalGlobal.document = win.document;

    // This is dirty hack to mocking DOM env with using jsdom.
    // eslint-disable-next-line no-global-assign
    global = winproxy;
}

function revertGlobalToOriginal() {
    // This is dirty hack to mocking DOM env with using jsdom.
    // eslint-disable-next-line no-global-assign
    global = originalGlobal;

    delete originalGlobal.window;
    delete originalGlobal.document;
}

function createWinProxy(win) {
    const winproxy = new Proxy(win, {
        get: function (obj, prop) {
            const hasOnWindow = prop in obj;
            return hasOnWindow ? obj[prop] : originalGlobal[prop];
        }
    });
    return winproxy;
}

module.exports = Object.freeze({
    createJsDomWindow,
    replaceGlobalWithJsDom,
    revertGlobalToOriginal,
});

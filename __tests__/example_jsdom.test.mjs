import test from 'ava';

import {
    createJsDomWindow,
    replaceGlobalWithJsDom,
    revertGlobalToOriginal,
} from './_helper_jsdom.mjs';

/* eslint-env browser */

test.before(() => {
    const win = createJsDomWindow();
    replaceGlobalWithJsDom(win);
});

test.after(() => {
    revertGlobalToOriginal();
});

test('`window` should be defined', (t) => {
    t.is(window, globalThis.window);
});

test('`document` should be defined', (t) => {
    t.is(document, globalThis.window.document);
});

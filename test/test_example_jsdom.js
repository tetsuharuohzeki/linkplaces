'use strict';

const test = require('ava');

const {
    createJsDomWindow,
    replaceGlobalWithJsDom,
    revertGlobalToOriginal,
} = require('./_helper_jsdom');

/* eslint-env browser */

test.before(() => {
    const win = createJsDomWindow();
    replaceGlobalWithJsDom(win);
});

test.after(() => {
    revertGlobalToOriginal();
});

test('`window` should be defined', (t) => {
    t.is(window, global.window);
});

test('`document` should be defined', (t) => {
    t.is(document, global.window.document);
});

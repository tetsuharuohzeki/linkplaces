import {
    type DomRef,
    createDomRef,
    createDomElement as dom,
    createDocFragmentTree as fragment,
    type HTMLCustomElementLifecycleHook,
} from '@linkplaces/foundation';

import { unwrapOrFromNullable } from 'option-t/Nullable/unwrapOr';
import type * as React from 'react';

export const ATTR_NAME_ICON_DIR = 'icondir';
export const ATTR_NAME_ICON_FILE = 'iconfile';

function pathGeneratorGen(colorScheme: string): (baseDir: string, filename: string) => string {
    return (baseDir, filename) => {
        return `${baseDir}${colorScheme}/${filename}`;
    };
}

const createURIForLight = pathGeneratorGen('light');
const createURIForDark = pathGeneratorGen('dark');
const createURIForCtxFill = pathGeneratorGen('context-fill');

export class PopupItemIconElement extends HTMLElement implements HTMLCustomElementLifecycleHook {
    static get observedAttributes(): Iterable<string> {
        return [ATTR_NAME_ICON_DIR, ATTR_NAME_ICON_FILE];
    }

    private _sourceForDark: DomRef<HTMLSourceElement> = createDomRef();
    private _sourceForLight: DomRef<HTMLSourceElement> = createDomRef();
    private _img: DomRef<HTMLImageElement> = createDomRef();
    private _iconDir: string = '';
    private _iconFile: string = '';

    constructor() {
        super();

        this._init();
    }

    private _init(): void {
        const shadowRoot = this.attachShadow({
            mode: 'open',
        });

        const iconDir = unwrapOrFromNullable(this.getAttribute(ATTR_NAME_ICON_DIR), '');
        const iconFile = unwrapOrFromNullable(this.getAttribute(ATTR_NAME_ICON_FILE), '');
        this._iconDir = iconDir;
        this._iconFile = iconFile;

        const tree = fragment([
            dom(
                'picture',
                [['class', `com-popup-PopupIconElement__icon`]],
                [
                    dom(
                        'source',
                        [
                            ['srcset', createURIForDark(iconDir, iconFile)],
                            ['media', '(prefers-color-scheme: dark)'],
                        ],
                        null,
                        this._sourceForDark
                    ),
                    dom(
                        'source',
                        [
                            ['srcset', createURIForLight(iconDir, iconFile)],
                            ['media', '(prefers-color-scheme: light)'],
                        ],
                        null,
                        this._sourceForLight
                    ),
                    dom(
                        'img',
                        [
                            ['src', createURIForCtxFill(iconDir, iconFile)],
                            ['alt', ''],
                        ],
                        null,
                        this._img
                    ),
                ]
            ),
        ]);

        shadowRoot.appendChild(tree);
    }

    attributeChangedCallback(attributeName: string, oldValue: string, newValue: string, _namespace: string): void {
        if (oldValue === newValue) {
            return;
        }

        switch (attributeName) {
            case ATTR_NAME_ICON_DIR: {
                this._iconDir = newValue;
                this._updateSrc();
                break;
            }
            case ATTR_NAME_ICON_FILE: {
                this._iconFile = newValue;
                this._updateSrc();
                break;
            }
            default:
                throw new RangeError(`Handling ${attributeName} has not been defined.`);
        }
    }

    private _updateSrc(): void {
        const iconDir = this._iconDir;
        const iconFile = this._iconFile;

        const sourceForDark = this._sourceForDark.current;
        if (sourceForDark !== null) {
            sourceForDark.setAttribute('srcset', createURIForDark(iconDir, iconFile));
        }

        const sourceForLight = this._sourceForLight.current;
        if (sourceForLight !== null) {
            sourceForLight.setAttribute('srcset', createURIForLight(iconDir, iconFile));
        }

        const img = this._img.current;
        if (img !== null) {
            img.setAttribute('src', createURIForCtxFill(iconDir, iconFile));
        }
    }
}

export const LOCAL_NAME_POPUP_ITEM_ICON = 'popup-item-icon';
interface PopupItemIconElementAttr {
    [ATTR_NAME_ICON_DIR]: string;
    [ATTR_NAME_ICON_FILE]: string;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            [LOCAL_NAME_POPUP_ITEM_ICON]: globalThis.React.DetailedHTMLProps<
                React.HTMLAttributes<PopupItemIconElement> & PopupItemIconElementAttr,
                PopupItemIconElement
            >;
        }
    }
}

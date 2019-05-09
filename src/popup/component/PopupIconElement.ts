import { unwrapOrFromNullable } from 'option-t/esm/Nullable/unwrapOr';

import {
    DomRef,
    createDomRef,
    createDomElement as dom,
    createDocFragmentTree as fragment,
    createTextNode as text,
} from '../../shared/domfactory';

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

export class PopupItemIconElement extends HTMLElement {

    static get observedAttributes(): Iterable<string> {
        return [ATTR_NAME_ICON_DIR, ATTR_NAME_ICON_FILE];
    }

    private _connectedOnce: boolean;
    private _sourceForDark: DomRef<HTMLSourceElement>;
    private _sourceForLight: DomRef<HTMLSourceElement>;
    private _img: DomRef<HTMLImageElement>;
    private _iconDir: string;
    private _iconFile: string;

    constructor() {
        super();
        this._connectedOnce = false;
        this._sourceForDark = createDomRef();
        this._sourceForLight = createDomRef();
        this._img = createDomRef();
        this._iconDir = '';
        this._iconFile = '';
    }

    connectedCallback(): void {
        if (this._connectedOnce) {
            return;
        }

        this._connectedOnce = true;

        const shadowRoot = this.attachShadow({
            mode: 'open',
        });

        const iconDir = unwrapOrFromNullable(this.getAttribute(ATTR_NAME_ICON_DIR), '');
        const iconFile = unwrapOrFromNullable(this.getAttribute(ATTR_NAME_ICON_FILE), '');
        this._iconDir = iconDir;
        this._iconFile = iconFile;

        const tree = fragment([
            dom('style', null, [
                text(`
                .com-popup-PopupIconElement__icon {
                    width: 16px;
                    height: 16px;
                    margin-inline-end: var(--margin-inline-end);
                }
                `),
            ]),

            dom('picture', new Map([
                ['class', `com-popup-PopupIconElement__icon`],
            ]),
                [
                    dom('source', new Map([
                        ['srcset', createURIForDark(iconDir, iconFile)],
                        ['media', '(prefers-color-scheme: dark)'],
                    ]), [], this._sourceForDark),
                    dom('source', new Map([
                        ['srcset', createURIForLight(iconDir, iconFile)],
                        ['media', '(prefers-color-scheme: light)'],
                    ]), [], this._sourceForLight),
                    dom('img', new Map([
                        ['src', createURIForCtxFill(iconDir, iconFile)],
                        ['alt', ''],
                    ]),
                        [],
                        this._img
                    ),
                ]),
        ]);

        shadowRoot.appendChild(tree);
    }

    disconnectedCallback(): void {
        this._img.release();
        this._sourceForLight.release();
        this._sourceForDark.release();
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
                throw new RangeError(`${attributeName} has not been defined in this.observedAttributes()`);
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

    adoptedCallback(_oldDocument: Document, _newDocument: Document): void {
        // don't support this operation.
    }
}

export const LOCAL_NAME_POPUP_ITEM_ICON = 'popup-item-icon';
interface PopupItemIconElementAttr {
    [ATTR_NAME_ICON_DIR]: string;
    [ATTR_NAME_ICON_FILE]: string;
}

declare global {
    // FIXME: @typescript-eslint does not support `declare global {}`
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
        interface IntrinsicElements {
            // FIXME: Remove this. @typescript-eslint/eslint-plugin cannot works with this pattern correctly
            // eslint-disable-next-line no-undef
            [LOCAL_NAME_POPUP_ITEM_ICON]: React.DetailedHTMLProps<React.HTMLAttributes<PopupItemIconElement> & PopupItemIconElementAttr, PopupItemIconElement>;
        }
    }
}

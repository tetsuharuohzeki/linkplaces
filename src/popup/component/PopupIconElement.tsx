import { unwrapOrFromNullable } from 'option-t/esm/Nullable/unwrapOr';

import {
    DomRef,
    createDomRef,
    createDomElement as dom,
    createDocFragmentTree as fragment,
    createTextNode as text,
} from '../../shared/domfactory';

export const ATTR_NAME_SRC = 'data-src';

const enum IconType {
    Item = 'item',
    Folder = 'folder',
}

abstract class PopupIconElement extends HTMLElement {

    static get observedAttributes(): Iterable<string> {
        return [ATTR_NAME_SRC];
    }

    private _connectedOnce: boolean;
    private _type: IconType;
    private _img: DomRef<HTMLImageElement>;

    constructor(type: IconType) {
        super();
        this._connectedOnce = false;
        this._type = type;
        this._img = createDomRef();
    }

    connectedCallback(): void {
        if (this._connectedOnce) {
            return;
        }

        this._connectedOnce = true;

        // This class is used by photon design system.
        this.classList.add('icon');

        const shadowRoot = this.attachShadow({
            mode: 'open',
        });

        const type: string = this._type;
        const src = unwrapOrFromNullable(this.getAttribute(ATTR_NAME_SRC), '');

        const tree = fragment([
            dom('style', null, [
                text(`
                img[class^="popup__listitem_icon_"] {
                    margin-inline-end: 1em;
                }
                `),
            ]),

            dom('img', new Map([
                ['class', `popup__listitem_icon_${type}`],
                ['src', src],
                ['alt', ''],
            ]),
            [],
            this._img),
        ]);

        shadowRoot.appendChild(tree);
    }

    disconnectedCallback(): void {
        this._img.release();
    }

    attributeChangedCallback(attributeName: string, oldValue: string, newValue: string, _namespace: string): void {
        if (attributeName !== ATTR_NAME_SRC) {
            throw new RangeError(`${attributeName} has not been defined in this.observedAttributes()`);
        }

        if (oldValue === newValue) {
            return;
        }

        const img = this._img.current;
        if (img === null) {
            return;
        }

        img.setAttribute('src', newValue);
    }

    adoptedCallback(_oldDocument: Document, _newDocument: Document): void {
        // don't support this operation.
    }
}

export const LOCAL_NAME_POPUP_FOLDER_ICON = 'popup-folder-icon';
export class PopupFolderIconElement extends PopupIconElement {
    constructor() {
        super(IconType.Folder);
    }
}
export interface PopupFolderIconElementAttr {
    [ATTR_NAME_SRC]: string;
}

export const LOCAL_NAME_POPUP_ITEM_ICON = 'popup-item-icon';
export class PopupItemIconElement extends PopupIconElement {
    constructor() {
        super(IconType.Item);
    }
}
export interface PopupItemIconElementAttr {
    [ATTR_NAME_SRC]: string;
}

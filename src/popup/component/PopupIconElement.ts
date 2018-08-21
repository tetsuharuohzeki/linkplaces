import { unwrapOrFromNullable } from 'option-t/esm/Nullable/unwrapOr';

import {
    DomRef,
    createDomRef,
    createDomElement as dom,
    createDocFragmentTree as fragment,
    createTextNode as text,
} from '../../shared/domfactory';

export const ATTR_NAME_SRC = 'src';

export class PopupItemIconElement extends HTMLElement {

    static get observedAttributes(): Iterable<string> {
        return [ATTR_NAME_SRC];
    }

    private _connectedOnce: boolean;
    private _img: DomRef<HTMLImageElement>;

    constructor() {
        super();
        this._connectedOnce = false;
        this._img = createDomRef();
    }

    connectedCallback(): void {
        if (this._connectedOnce) {
            return;
        }

        this._connectedOnce = true;

        const shadowRoot = this.attachShadow({
            mode: 'open',
        });

        const src = unwrapOrFromNullable(this.getAttribute(ATTR_NAME_SRC), '');

        const tree = fragment([
            dom('style', null, [
                text(`
                .com-popup-PopupIconElement__icon {
                    margin-inline-end: var(--margin-inline-end);
                }
                `),
            ]),

            dom('img', new Map([
                ['class', `com-popup-PopupIconElement__icon`],
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

export const LOCAL_NAME_POPUP_ITEM_ICON = 'popup-item-icon';
interface PopupItemIconElementAttr {
    [ATTR_NAME_SRC]: string;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            [LOCAL_NAME_POPUP_ITEM_ICON]: React.DetailedHTMLProps<React.HTMLAttributes<PopupItemIconElement> & PopupItemIconElementAttr, PopupItemIconElement>;
        }
    }
}

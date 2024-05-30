import type { Nullable } from 'option-t/nullable';

/**
 *  This interface is useful to avoid warnings by `@typescript-eslint/class-methods-use-this`'s false positive.
 *
 *  @see https://html.spec.whatwg.org/multipage/custom-elements.html#concept-custom-element-definition-lifecycle-callbacks
 */
export interface HTMLCustomElementLifecycleHook {
    connectedCallback?(): void;
    disconnectedCallback?(): void;
    adoptedCallback?(oldDocument: Document, newDocument: Document): void;
    attributeChangedCallback?(
        localName: string,
        oldValue: Nullable<string>,
        newValue: Nullable<string>,
        namespace?: Nullable<string>
    ): void;

    formAssociatedCallback?(form: Nullable<HTMLFormElement>): void;
    formDisabledCallback?(isDisabled: boolean): void;
    formResetCallback?(): void;
    formStateRestoreCallback?(state: Nullable<string | File | FormData>, reason: FormStateRestoreReason): void;
}

export interface HTMLCustomElementConnectedListenable {
    connectedCallback(): void;
}

export interface HTMLCustomElementDisconnectedListenable {
    disconnectedCallback(): void;
}

export interface HTMLCustomElementAdoptedListenable {
    adoptedCallback(oldDocument: Document, newDocument: Document): void;
}

export interface HTMLCustomElementAttributeChangeListenable {
    attributeChangedCallback(
        localName: string,
        oldValue: Nullable<string>,
        newValue: Nullable<string>,
        namespace?: Nullable<string>
    ): void;
}

export interface HTMLCustomElementFormAssociatedListenable {
    formAssociatedCallback(form: Nullable<HTMLFormElement>): void;
}

export interface HTMLCustomElementFormDisabledListenable {
    formDisabledCallback(isDisabled: boolean): void;
}

export interface HTMLCustomElementFormResetListenable {
    formResetCallback(): void;
}

export interface HTMLCustomElementFormStateRestoreListenable {
    formStateRestoreCallback(state: Nullable<string | File | FormData>, reason: FormStateRestoreReason): void;
}

type FormStateRestoreReason = 'autocomplete' | 'restore';

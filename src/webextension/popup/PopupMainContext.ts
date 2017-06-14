import { ViewContext } from '../shared/ViewContext';

export class PopupMainContext implements ViewContext {

    constructor() {}

    onActivate(_mountpoint: Element): void {
        throw new Error("Method not implemented.");
    }
    onDestroy(_mountpoint: Element): void {
        throw new Error("Method not implemented.");
    }

    onResume(_mountpoint: Element): void {
        throw new Error("Method not implemented.");
    }
    onSuspend(_mountpoint: Element): void {
        throw new Error("Method not implemented.");
    }
}

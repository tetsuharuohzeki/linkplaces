import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { ViewContext } from '../shared/ViewContext';

import { PopupMainView } from './view/PopupMainView';

export class PopupMainContext implements ViewContext {

    constructor() {}

    onActivate(mountpoint: Element): void {
        const view = React.createElement(PopupMainView, undefined, []);
        ReactDOM.render(view, mountpoint);
    }

    onDestroy(mountpoint: Element): void {
        ReactDOM.unmountComponentAtNode(mountpoint);
    }

    onResume(_mountpoint: Element): void {
        throw new Error("Method not implemented.");
    }
    onSuspend(_mountpoint: Element): void {
        throw new Error("Method not implemented.");
    }
}

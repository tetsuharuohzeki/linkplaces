import * as React from 'react';
import { Store } from 'redux';
//import * as PropTypes from 'prop-types';

import { openSidebar } from '../PopupIntent';
import { PopupMainState } from '../PopupMainState';

export interface PopupMainViewProps {
    state: PopupMainState;
    store: Store<PopupMainState>;
}

export function PopupMainView(props: Readonly<PopupMainViewProps>): JSX.Element {
    const onClick = (_event: React.MouseEvent<HTMLDivElement>) => {
        const a = openSidebar();
        props.store.dispatch(a);
    };

    return (
        <div className={'panel'}>
            <div className={'panel-section panel-section-list'}>
                <ul>
                    <li>{'item 1'}</li>
                    <li>{'item 2'}</li>
                    <li>{'item 3'}</li>
                </ul>
            </div>
            <div className={'panel-section panel-section-footer'}>
                <div className={'panel-section-footer-button'}
                    onClick={onClick}>
                    {'View LinkPlaces Sidebar'}
                </div>
            </div>
        </div>
    );
}
(PopupMainView as React.StatelessComponent<PopupMainViewProps>).propTypes = {
};

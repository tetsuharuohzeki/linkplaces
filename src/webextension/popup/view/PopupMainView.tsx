import * as React from 'react';
//import * as PropTypes from 'prop-types';

export interface PopupMainViewProps {
}

export function PopupMainView(_props: PopupMainViewProps): JSX.Element {
    const onClick = (_event: React.MouseEvent<HTMLDivElement>) => {
        console.log('toggle event dispatch!');//TODOß
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

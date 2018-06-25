import React from 'react';
import PropTypes from 'prop-types';

export interface PanelListItemTextProps {
    children: React.ReactNode;
}

export function PanelListItemText(props: PanelListItemTextProps): JSX.Element {
    return (
        <div className={'text'}>
            {props.children}
        </div>
    );
}
if (process.env.RELEASE_CHANNEL !== 'production') {
    (PanelListItemText as React.StatelessComponent<PanelListItemTextProps>).propTypes = {
        children: PropTypes.node.isRequired,
    };
}

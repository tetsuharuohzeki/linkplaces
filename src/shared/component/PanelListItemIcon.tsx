import React from 'react';
import PropTypes from 'prop-types';

export interface PanelListItemIconTextProps {
    children: React.ReactNode;
}

export function PanelListItemIcon(props: PanelListItemIconTextProps): JSX.Element {
    return (
        <div className={'icon'}>
            {props.children}
        </div>
    );
}
if (process.env.RELEASE_CHANNEL !== 'production') {
    (PanelListItemIcon as React.StatelessComponent<PanelListItemIconTextProps>).propTypes = {
        children: PropTypes.node.isRequired,
    };
}

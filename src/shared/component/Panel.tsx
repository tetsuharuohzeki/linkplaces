import React from 'react';
import PropTypes from 'prop-types';

export interface PanelProps {
    children: React.ReactNode;
}

export function Panel(props: PanelProps): JSX.Element {
    return (
        <div className={'panel'}>
            {props.children}
        </div>
    );
}
if (process.env.RELEASE_CHANNEL !== 'production') {
    (Panel as React.StatelessComponent<PanelProps>).propTypes = {
        children: PropTypes.node.isRequired,
    };
}

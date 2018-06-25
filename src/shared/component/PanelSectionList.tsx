import React from 'react';
import PropTypes from 'prop-types';

export interface PanelSectionListProps {
    children: React.ReactNode;
}

export function PanelSectionList(props: PanelSectionListProps): JSX.Element {
    return (
        <div className={'panel-section panel-section-list'}>
            {props.children}
        </div>
    );
}
if (process.env.RELEASE_CHANNEL !== 'production') {
    (PanelSectionList as React.StatelessComponent<PanelSectionListProps>).propTypes = {
        children: PropTypes.node.isRequired,
    };
}

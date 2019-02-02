import React from 'react';
import PropTypes from 'prop-types';
/* global process:readable */

export interface PanelSectionHeaderProps {
    children: React.ReactNode;
}

export function PanelSectionHeader(props: PanelSectionHeaderProps): JSX.Element {
    return (
        <header className={'shared-com-PanelSectionHeader__container'}>
            {props.children}
        </header>
    );
}
if (process.env.RELEASE_CHANNEL !== 'production') {
    (PanelSectionHeader as React.FunctionComponent<PanelSectionHeaderProps>).propTypes = {
        children: PropTypes.node.isRequired,
    };
}

export interface PanelSectionHeaderIconProps {
    children: React.ReactNode;
}

export function PanelSectionHeaderIcon(props: PanelSectionHeaderIconProps): JSX.Element {
    return (
        <div className={'shared-com-PanelSectionHeader__icon'}>
            {props.children}
        </div>
    );
}
if (process.env.RELEASE_CHANNEL !== 'production') {
    (PanelSectionHeaderIcon as React.FunctionComponent<PanelSectionHeaderIconProps>).propTypes = {
        children: PropTypes.node.isRequired,
    };
}

export interface PanelSectionHeaderTextProps {
    children: React.ReactNode;
}

export function PanelSectionHeaderText(props: PanelSectionHeaderTextProps): JSX.Element {
    return (
        <div className={'shared-com-PanelSectionHeader__text'}>
            {props.children}
        </div>
    );
}
if (process.env.RELEASE_CHANNEL !== 'production') {
    (PanelSectionHeaderText as React.FunctionComponent<PanelSectionHeaderTextProps>).propTypes = {
        children: PropTypes.node.isRequired,
    };
}

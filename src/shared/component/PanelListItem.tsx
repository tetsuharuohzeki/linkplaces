import React from 'react';
import PropTypes from 'prop-types';

/* global process:readable */

export interface PanelListItemProps {
    children: React.ReactNode;
    disabled?: boolean;
    onClick?: React.MouseEventHandler;
}

export function PanelListItem(props: PanelListItemProps): JSX.Element {
    const {
        disabled = false,
    } = props;

    const className = disabled ?
        'shared-com-PanelListItem__container disabled' :
        'shared-com-PanelListItem__container';

    return (
        <div className={className} onClick={props.onClick}>
            {props.children}
        </div>
    );
}
if (process.env.RELEASE_CHANNEL !== 'production') {
    (PanelListItem as React.FunctionComponent<PanelListItemProps>).propTypes = {
        disabled: PropTypes.bool,
        onClick: PropTypes.func,
    };
}

export interface PanelListItemIconProps {
    children: React.ReactNode;
}

export function PanelListItemIcon(props: PanelListItemIconProps): JSX.Element {
    return (
        <div className={'shared-com-PanelListItem__icon'}>
            {props.children}
        </div>
    );
}
if (process.env.RELEASE_CHANNEL !== 'production') {
    (PanelListItemText as React.FunctionComponent<PanelListItemIconProps>).propTypes = {
        children: PropTypes.node.isRequired,
    };
}


export interface PanelListItemTextProps {
    children: React.ReactNode;
}

export function PanelListItemText(props: PanelListItemTextProps): JSX.Element {
    return (
        <div className={'shared-com-PanelListItem__text'}>
            {props.children}
        </div>
    );
}
if (process.env.RELEASE_CHANNEL !== 'production') {
    (PanelListItemText as React.FunctionComponent<PanelListItemTextProps>).propTypes = {
        children: PropTypes.node.isRequired,
    };
}

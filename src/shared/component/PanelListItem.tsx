import React from 'react';
import PropTypes from 'prop-types';

export interface PanelListItemProps {
    children: React.ReactNode;
    onClick?: React.MouseEventHandler;
}

export function PanelListItem(props: PanelListItemProps): JSX.Element {
    return (
        <div className={'shared-com-PanelListItem__container'} onClick={props.onClick}>
            {props.children}
        </div>
    );
}
/*
// FIXME: PropTypes is too strict.
if (process.env.RELEASE_CHANNEL !== 'production') {
    (PanelListItem as React.StatelessComponent<PanelListItemProps>).propTypes = {
        children: PropTypes.node.isRequired,
        onClick: PropTypes.func,
    };
}
*/

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
    (PanelListItemText as React.StatelessComponent<PanelListItemIconProps>).propTypes = {
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
    (PanelListItemText as React.StatelessComponent<PanelListItemTextProps>).propTypes = {
        children: PropTypes.node.isRequired,
    };
}

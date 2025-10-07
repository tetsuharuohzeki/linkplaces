import { StrictMode, type MouseEventHandler, type ReactNode } from 'react';

export interface PanelListItemProps {
    children: ReactNode;
    disabled?: boolean;
    onClick?: MouseEventHandler;
}

export function PanelListItem(props: PanelListItemProps): ReactNode {
    const { disabled = false, onClick } = props;

    const className = disabled ? 'shared-com-PanelListItem__container disabled' : 'shared-com-PanelListItem__container';

    return (
        <StrictMode>
            <div
                className={className}
                onClick={onClick}
                aria-disabled={disabled}
            >
                {props.children}
            </div>
        </StrictMode>
    );
}

export interface PanelListItemIconProps {
    children: ReactNode;
}

export function PanelListItemIcon(props: PanelListItemIconProps): ReactNode {
    return (
        <StrictMode>
            <div className={'shared-com-PanelListItem__icon'}>{props.children}</div>
        </StrictMode>
    );
}

export interface PanelListItemTextProps {
    children: ReactNode;
}

export function PanelListItemText(props: PanelListItemTextProps): ReactNode {
    return (
        <StrictMode>
            <div className={'shared-com-PanelListItem__text'}>{props.children}</div>
        </StrictMode>
    );
}

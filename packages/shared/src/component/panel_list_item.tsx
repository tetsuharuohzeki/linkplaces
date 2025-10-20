import { StrictMode, type MouseEventHandler, type ReactNode } from 'react';

export interface PanelListItemProps {
    children: ReactNode;
    disabled?: boolean;
    onClick?: MouseEventHandler;
}

export function PanelListItem(props: PanelListItemProps): ReactNode {
    const { disabled = false, onClick, children } = props;

    const className = disabled ? 'shared-com-PanelListItem__container disabled' : 'shared-com-PanelListItem__container';

    return (
        <StrictMode>
            <div
                className={className}
                onClick={onClick}
                aria-disabled={disabled}
            >
                {children}
            </div>
        </StrictMode>
    );
}

export interface PanelListItemIconProps {
    children: ReactNode;
}

export function PanelListItemIcon({ children }: PanelListItemIconProps): ReactNode {
    return (
        <StrictMode>
            <div className={'shared-com-PanelListItem__icon'}>{children}</div>
        </StrictMode>
    );
}

export interface PanelListItemTextProps {
    children: ReactNode;
}

export function PanelListItemText({ children }: PanelListItemTextProps): ReactNode {
    return (
        <StrictMode>
            <div className={'shared-com-PanelListItem__text'}>{children}</div>
        </StrictMode>
    );
}

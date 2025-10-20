import { StrictMode, type ReactNode, type Key as ReactKey } from 'react';

export interface PanelSectionListProps {
    children: ReactNode;
}

export function PanelSectionList({ children }: PanelSectionListProps): ReactNode {
    return (
        <StrictMode>
            <div className={'shared-com-PanelSectionList__container'}>{children}</div>
        </StrictMode>
    );
}

export interface PanelSectionListSeparatorProps {
    key?: ReactKey;
}

export function PanelSectionListSeparator(_props: PanelSectionListSeparatorProps): ReactNode {
    return (
        <StrictMode>
            <div
                className={'shared-com-PanelSectionList__separator'}
                role={'separator'}
            ></div>
        </StrictMode>
    );
}

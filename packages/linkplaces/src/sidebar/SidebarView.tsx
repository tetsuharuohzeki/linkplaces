import { Ix } from '@linkplaces/foundation';
import { PanelSectionList } from '@linkplaces/shared/component';

import { StrictMode, type ReactNode } from 'react';
import type { SidebarIntent } from './SidebarIntent.js';
import type { SidebarState } from './SidebarState.js';
import { ListItem } from './view/SidebarListItemView.js';

export interface SidebarViewProps {
    state: Readonly<SidebarState>;
    intent: SidebarIntent;
}

export function SidebarView(props: Readonly<SidebarViewProps>): ReactNode {
    const mapped = Ix.map(props.state.list, (item) => {
        const id = item.id();
        return (
            <ListItem
                key={id}
                item={item}
                intent={props.intent}
            />
        );
    });

    const r: Array<ReactNode> = Ix.toArray(mapped);
    return (
        <StrictMode>
            <main>
                <PanelSectionList>{r}</PanelSectionList>
            </main>
        </StrictMode>
    );
}

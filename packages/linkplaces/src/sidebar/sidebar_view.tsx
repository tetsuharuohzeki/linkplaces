import { Ix } from '@linkplaces/foundation';
import { PanelSectionList } from '@linkplaces/shared/component';

import { StrictMode, type ReactNode } from 'react';
import type { SidebarIntent } from './sidebar_intent.js';
import type { SidebarState } from './sidebar_state.js';
import { ListItem } from './view/sidebar_list_item_view.jsx';

export interface SidebarViewProps {
    state: Readonly<SidebarState>;
    intent: SidebarIntent;
}

export function SidebarView({ state, intent }: Readonly<SidebarViewProps>): ReactNode {
    const mapped = Ix.map(state.list, (item) => {
        const id = item.id();
        return (
            <ListItem
                key={id}
                item={item}
                intent={intent}
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

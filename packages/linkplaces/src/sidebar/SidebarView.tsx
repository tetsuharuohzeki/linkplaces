import { Ix } from '@linkplaces/foundation';
import { PanelSectionList } from '@linkplaces/shared/component';

import { StrictMode } from 'react';
import type { SidebarIntent } from './SidebarIntent.js';
import type { SidebarState } from './SidebarState.js';
import { ListItem } from './view/SidebarListItemView.js';

export interface SidebarViewProps {
    state: Readonly<SidebarState>;
    intent: SidebarIntent;
}

export function SidebarView(props: Readonly<SidebarViewProps>): JSX.Element {
    const mapped = Ix.map(props.state.list, (item) => {
        const id = item.id();
        return (
            <ListItem key={id} item={item} intent={props.intent} />
        );
    });

    const r: Array<JSX.Element> = Ix.toArray(mapped);
    return (
        <StrictMode>
            <main>
                <PanelSectionList>
                    {r}
                </PanelSectionList>
            </main>
        </StrictMode>
    );
}

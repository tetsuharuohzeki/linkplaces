import { StrictMode } from 'react';
import { PanelSectionList } from '../shared/component/PanelSectionList';
import * as Ix from '../shared/ix/mod';
import { SidebarIntent } from './SidebarIntent';
import { SidebarState } from './SidebarState';
import { ListItem } from './view/SidebarListItemView';

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

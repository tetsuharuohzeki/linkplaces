import { from as fromIterableToIterableX } from '@reactivex/ix-esnext-esm/iterable/from';
import { map } from '@reactivex/ix-esnext-esm/iterable/operators/map';
import { toArray as toArrayFromIx } from '@reactivex/ix-esnext-esm/iterable/toarray';

import { StrictMode } from 'react';
import { PanelSectionList } from '../shared/component/PanelSectionList';
import { SidebarState } from './SidebarState';
import { SidebarReduxStore } from './SidebarStore';
import { ListItem } from './view/SidebarListItemView';

export interface SidebarViewProps {
    state: Readonly<SidebarState>;
    store: SidebarReduxStore;
}

export function SidebarView(props: Readonly<SidebarViewProps>): JSX.Element {
    const mapped = fromIterableToIterableX(props.state.list)
        .pipe(
            map((item) => {
                const id = item.id();
                return (
                    <ListItem key={id} item={item} store={props.store} />
                );
            }),
        );

    const r: Array<JSX.Element> = toArrayFromIx(mapped);
    return (
        <StrictMode>
            <div>
                <PanelSectionList>
                    {r}
                </PanelSectionList>
            </div>
        </StrictMode>
    );
}

import { from as fromIterableToIterableX } from '@reactivex/ix-esnext-esm/iterable/from';
import { map } from '@reactivex/ix-esnext-esm/iterable/operators/map';
import { toArray as toArrayFromIx } from '@reactivex/ix-esnext-esm/iterable/toarray';

import * as React from 'react';
import { PanelSectionList } from '../shared/component/PanelSectionList';
import { SidebarIntent } from './SidebarIntent';
import { SidebarState } from './SidebarState';
import { ListItem } from './view/SidebarListItemView';

export interface SidebarViewProps {
    state: Readonly<SidebarState>;
    intent: SidebarIntent;
}

export function SidebarView(props: Readonly<SidebarViewProps>): JSX.Element {
    const mapped = fromIterableToIterableX(props.state.list)
        .pipe(
            map((item) => {
                const id = item.id();
                return (
                    <ListItem key={id} item={item} intent={props.intent} />
                );
            }),
        );

    const r: Array<JSX.Element> = toArrayFromIx(mapped);
    return (
        <React.StrictMode>
            <div>
                <PanelSectionList>
                    {r}
                </PanelSectionList>
            </div>
        </React.StrictMode>
    );
}

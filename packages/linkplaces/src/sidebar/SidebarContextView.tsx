import { StrictMode, useSyncExternalStore, type ReactNode } from 'react';

import type { SidebarIntent } from './SidebarIntent.js';
import type { SidebarPlainReduxStore } from './SidebarStore.js';
import { SidebarView } from './SidebarView.js';

export interface SidebarViewUpdaterProps {
    store: SidebarPlainReduxStore;
    intent: SidebarIntent;
}

export function SidebarViewUpdater({ store, intent }: SidebarViewUpdaterProps): ReactNode {
    const state = useSyncExternalStore(
        (onStoreChange) => {
            const disposer = store.subscribe(onStoreChange);
            return () => {
                disposer();
            };
        },
        () => {
            const state = store.state();
            return state;
        }
    );

    const view = (
        <StrictMode>
            <SidebarView
                state={state}
                intent={intent}
            />
        </StrictMode>
    );
    return view;
}

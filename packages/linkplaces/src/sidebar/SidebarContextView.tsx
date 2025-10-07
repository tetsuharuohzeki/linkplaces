import { Subscription } from '@linkplaces/foundation/rx';
import { StrictMode, useEffect, useSyncExternalStore, type ReactNode } from 'react';

import type { SidebarIntent } from './SidebarIntent.js';
import { subscribeSidebarRepositoryBySidebarStore, type SidebarPlainReduxStore } from './SidebarStore.js';
import { SidebarView } from './SidebarView.js';
import { activateDragAndDropTextItemHandling } from './intent/drag_and_drop.js';
import { initHandlingPasteEvent } from './intent/paste.js';
import type { SidebarRepository } from './repository/SidebarRepository.js';

export interface SidebarViewUpdaterProps {
    store: SidebarPlainReduxStore;
    intent: SidebarIntent;
    repo: SidebarRepository;
}

export function SidebarViewUpdater({ store, intent, repo }: SidebarViewUpdaterProps): ReactNode {
    useEffect(() => {
        const rootSubscription = new Subscription(null);
        rootSubscription.add(subscribeSidebarRepositoryBySidebarStore(store, repo));
        rootSubscription.add(initHandlingPasteEvent(window, intent));
        rootSubscription.add(activateDragAndDropTextItemHandling(window, intent));

        return () => {
            rootSubscription.unsubscribe();
        };
    }, [intent, repo, store]);

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

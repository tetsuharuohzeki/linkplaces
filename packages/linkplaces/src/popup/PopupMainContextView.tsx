import { browser } from '@linkplaces/webext_types';

import { StrictMode, useEffect, useMemo, type ReactNode } from 'react';

import type { PopupMainIntent } from './PopupMainIntent.js';
import { usePopupMainState, type PopupPlainReduxStore } from './PopupMainStore.js';
import { PopupMainView } from './PopupMainView.js';
import { PopupRepostiroy } from './PopupRepository.js';

export interface PopupMainViewUpdaterProps {
    store: PopupPlainReduxStore;
    intent: PopupMainIntent;
}

export function PopupMainViewUpdater({ store, intent }: PopupMainViewUpdaterProps): ReactNode {
    const repository = useMemo(() => new PopupRepostiroy(browser.bookmarks, store), [store]);
    const state = usePopupMainState(store);

    useEffect(() => {
        repository.start();
        return () => {
            repository.stop();
        };
    }, [repository]);

    const view = (
        <StrictMode>
            <PopupMainView
                state={state}
                intent={intent}
            />
        </StrictMode>
    );
    return view;
}

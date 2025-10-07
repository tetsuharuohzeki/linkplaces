import { browser } from '@linkplaces/webext_types';

import { StrictMode, useEffect, useMemo, type ReactNode } from 'react';

import type { PopupMainIntent } from './popup_main_intent.js';
import { usePopupMainState, type PopupPlainReduxStore } from './popup_main_store.js';
import { PopupMainView } from './popup_main_view.js';
import { PopupRepostiroy } from './popup_repository.js';

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

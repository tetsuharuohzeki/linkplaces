import type { FullListener } from './event';
import type { Tab } from './tabs';

export interface WebExtPageActionService {
    onClicked: FullListener<(this: void, tab: Tab) => void>;
}

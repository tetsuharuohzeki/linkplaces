import type { ObservableLike } from './observable';
import type { Observer } from './subscriber';

export interface Subjectable<T> extends Observer<T>, ObservableLike<T> {}

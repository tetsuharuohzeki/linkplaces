import type { ObservableLike } from './observable';
import type { Observer } from './observer';

export interface Subjectable<T> extends Observer<T>, ObservableLike<T> {}

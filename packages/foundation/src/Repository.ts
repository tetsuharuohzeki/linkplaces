import type { Observable } from './rx/mod.js';

export interface Repository<T> {
    destroy(): void;
    asObservable(): Observable<T>;
}

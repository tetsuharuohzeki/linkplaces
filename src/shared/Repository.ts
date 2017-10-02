import { Observable } from 'rxjs/Observable';

export interface Repository<T> {
    destroy(): void;
    asObservable(): Observable<T>;
}

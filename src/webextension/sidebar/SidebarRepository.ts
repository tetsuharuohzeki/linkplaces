import { Observable, Observer } from 'rxjs';
import { Repository } from '../shared/Repository';

export class SidebarRepository implements Repository<void>, Observer<void> {
    next(_: void): void {
    }

    error(_: any): void {
    }

    complete(): void {
    }

    destroy(): void {
    }

    asObservable(): Observable<void> {
        throw new Error('Method not implemented.');
    }
}

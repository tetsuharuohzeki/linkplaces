import type { Observable } from '../core/observable.js';
import { OperatorObservable, type OperatorFunction } from '../core/operator.js';
import type { Subscriber } from '../core/subscriber.js';
import type { Subject } from '../mod.js';

class MulticastObservable<T> extends OperatorObservable<T, T> {
    private _connector: Subject<T>;

    constructor(source: Observable<T>, connector: Subject<T>) {
        super(source);
        this._connector = connector;
    }

    protected override onSubscribe(destination: Subscriber<T>): void {
        const connectorSubject = this._connector;
        connectorSubject.asObservable().subscribe(destination);
        const sourceSub = this.source.subscribe(connectorSubject);
        destination.addTeardown(() => {
            sourceSub.unsubscribe();
        });
    }
}

export function multicast<T>(subject: Subject<T>): OperatorFunction<T, T> {
    const operator: OperatorFunction<T, T> = (source: Observable<T>) => {
        const connected = new MulticastObservable<T>(source, subject);
        return connected;
    };
    return operator;
}

type SubjectFactoryFn<T> = () => Subject<T>;

class MulticastWithNewSubjectObservable<T> extends OperatorObservable<T, T> {
    private _connector: SubjectFactoryFn<T>;

    constructor(source: Observable<T>, connector: SubjectFactoryFn<T>) {
        super(source);
        this._connector = connector;
    }

    protected override onSubscribe(destination: Subscriber<T>): void {
        const connectorSubject = this._connector();
        connectorSubject.asObservable().subscribe(destination);
        const sourceSub = this.source.subscribe(connectorSubject);
        destination.addTeardown(() => {
            sourceSub.unsubscribe();
        });
    }
}

export function multicastWithNewSubject<T>(subjectFactory: SubjectFactoryFn<T>): OperatorFunction<T, T> {
    const operator: OperatorFunction<T, T> = (source: Observable<T>) => {
        const connected = new MulticastWithNewSubjectObservable<T>(source, subjectFactory);
        return connected;
    };
    return operator;
}

import test from 'ava';
import { BehaviorSubject, SubscriptionError } from '../../../../mod.js';

test('prevent cycle myself', (t) => {
    const target = new BehaviorSubject<number>(1);

    t.throws(
        () => {
            target.asObservable().subscribe(target);
        },
        {
            instanceOf: SubscriptionError,
            message: 'recursive subscription happens',
        }
    );
});

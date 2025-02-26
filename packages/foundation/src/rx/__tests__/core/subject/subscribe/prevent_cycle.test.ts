import test from 'ava';
import { Subject, SubscriptionError } from '../../../../mod.js';

test('prevent cycle myself', (t) => {
    const target = new Subject<number>();

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

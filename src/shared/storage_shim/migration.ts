import { Result, isErr, createOk } from 'option-t/esm/PlainResult/Result';
import { unwrapFromResult } from 'option-t/esm/PlainResult/unwrap';
import { PrefixedStorage } from './PrefixedStorage';

/**
 *  This function would write a new version after _migrator_ completed.
 *
 *  This is a design choice to consider safety if the application is shutdown
 *  by user-agent by happening somethings during the application is migrating storage.
 *
 *  DOM Storage does not have transaction model.
 *  In practice, we assume that we almost would not face such kind of hazard,
 *  however,  we cannot do safely this kind of migration ultimately.
 *
 *  In other word, **we should not do breaking change storage schema as possible** :(
 *  However, this will not advance this talk. We think this design limitation would lead following rules:
 *
 *      1. The migrator function should ignore the migration of _key A_ if there is no entry for _key _A_.
 *      2. The migrator should clear the old key after success to write a new key.
 *      3. The old key and the new key must not have a same name in consecutive versions.
 *          * If you do breaking change for key _A_ in version _2_,
 *            you must not use the same key name for new entry.
 *            If you do that, the migrator might not do _rule 1_.
 *      4. The migrator should migrate schema only single version at the time.
 *          * This rule is to follow _rule 4_. As a checkpoint, it would should be better write a scheme version one by one.
 *
 *  This design is adhoc but the migratior would get idempotency.
 *
 *  Let's think about the case of that the migrator has these rules.
 *  If your migrator starts its migration on the storage
 *  which almostly was migrated but was not set new version _v2_ from _v1_,
 *  then migrator would run the migration process for _v1_ again.
 *  But this would not do nothing because
 *
 *      1. The migrator does not do anything if there is no old key.
 *      2. Even if there is a old key,  the migrator will migrate it to the new key.
 *      3. If the application happened to shutdown accidentally,
 *         the application would not do other anythings.
 *         We can assume that the storage would not be modified by the new schema.
 *
 *  By these thinking, we also don't write in-migration flag entry.
 *  We cannot also do it transactionally with the version entry.
 *  So we should do write a migrator as idempotency...
 */

export interface Migrator<TKeyEnum extends string> {
    (storage: PrefixedStorage<TKeyEnum>, currentVersion: number): Promise<void>;
}

export async function upgradeStorage<TKeyEnum extends string>(
    storage: PrefixedStorage<TKeyEnum>,
    versionKey: TKeyEnum,
    migrator: Migrator<TKeyEnum>,
    newVersion: number
): Promise<Result<void, unknown>> {
    const currentVersionResult = await storage.getJSON<number>(versionKey);
    if (isErr(currentVersionResult)) {
        return currentVersionResult;
    }

    const currentVersion = unwrapFromResult(currentVersionResult);
    if (currentVersion !== null) {
        if (newVersion > currentVersion) {
            await migrator(storage, currentVersion);
        }
    }

    const update = await storage.setJSON(versionKey, newVersion);
    return update;
}

export async function upgradeStorage2<TKeyEnum extends string>(
    storage: PrefixedStorage<TKeyEnum>,
    versionKey: TKeyEnum,
    migrator: Migrator<TKeyEnum>,
    newVersion: number
): Promise<Result<void, unknown>> {
    const currentVersionResult = await storage.getJSON<number>(versionKey);
    if (isErr(currentVersionResult)) {
        return currentVersionResult;
    }

    const currentVersion = unwrapFromResult(currentVersionResult);
    if (currentVersion === null) {
        // for the first conversion.
        const update = await storage.setJSON(versionKey, newVersion);
        return update;
    }

    if (currentVersion >= newVersion) {
        // the application code may be old.
        return createOk(undefined);
    }

    let current = currentVersion;
    while (newVersion > current) {
        // XXX: We need to run these steps sequentially.
        // These operation has an order.
        // eslint-disable-next-line no-await-in-loop
        await migrator(storage, current);
        const incremented = current + 1;
        // eslint-disable-next-line no-await-in-loop
        const r = await storage.setJSON(versionKey, incremented);
        if (isErr(r)) {
            return r;
        }
        current = incremented;
    }

    return createOk(undefined);
}

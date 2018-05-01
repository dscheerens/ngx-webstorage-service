import { BaseStorageService } from './base-storage.service';
import { StorageTranscoders } from './storage-transcoders';

/**
 * An implementation of `StorageService` interface that uses an underlying (web) `Storage` object, such as `localStorage` and
 * `sessionStorage`, as backing data store. This class basically wraps the `Storage` object so it can be accessed through the
 * `StorageService` interface.
 */
export class WebStorageService extends BaseStorageService<any> {

    /**
     * Creates a new `WebStorageService` instance that uses the specified (web) storage object as underlying backing storage.
     *
     * @param storage Storage object which is to be wrapped in a class that implements the `StorageService` interface.
     */
    constructor(private readonly storage: Storage) {
        super(StorageTranscoders.JSON);
    }

    /**
     * Checks whether an entry with the specified key exists in the storage.
     *
     * @param   key Identifier of the entry for which its presence in the storage is to be checked.
     * @returns     `true` if an entry with the specified key exists in the storage, `false` if not.
     */
    public has(key: string): boolean {
        return this.storage.getItem(key) !== null;
    }

    /**
     * Removes the entry that is identified by the specified key. Attempting to remove an entry for an unknown key will have no effect.
     * Attempting to retrieve an entry via the `get` method after it has been removed will result in `undefined`.
     *
     * @param key Identifier of the entry which is to be removed.
     */
    public remove(key: string): void {
        this.storage.removeItem(key);
    }

    /**
     * Clears the storage by removing all entries. Subsequent `get(x)` calls for a key *x* will return `undefined`, until a new value is set
     * for key *x*.
     */
    public clear(): void {
        this.storage.clear();
    }

    /**
     * Performs the actual retrieval of a value from storage.
     *
     * @param   key Identifier of the entry whose value is to be retrieved.
     * @returns     The value that is stored for the specified entry or `undefined` if no entry exists for the specified key.
     */
    protected getItem(key: string): string | undefined {
        const value = this.storage.getItem(key);

        return value !== null ? value : undefined;
    }

    /**
     * Stores the provided value using specified key in the storage.
     *
     * @param key   Identifier of the entry for which the value is to be stored.
     * @param value The value that is to be stored.
     */
    protected setItem(key: string, value: string): void {
        return this.storage.setItem(key, value);
    }

}

/**
 * Checks whether the specified (web) storage is available and functional. This might not be the case for older browsers. However even
 * certain browsers that do support the web storage API can, under some circumstances, have non functional storage objects. For example,
 * Safari is known to have `localStorage` and `sessionStorage` throw exceptions in private mode.
 *
 * @param   storage Storage object which is to be tested for availability.
 * @returns         `true` if the specified storage can be used, `false` if not.
 */
export function isStorageAvailable(storage: Storage): boolean {
    // Check if storage is available.
    if (!storage) {
        return false;
    }

    // Check if the storage can actually be accessed.
    try {
        const now = Date.now();
        const testItemKey = `storage-test-entry-${now}`;
        const testItemValue = `storage-test-value-${now}`;
        storage.setItem(testItemKey, testItemValue);
        const retrievedItemValue = storage.getItem(testItemKey);
        storage.removeItem(testItemKey);

        return retrievedItemValue === testItemValue;
    } catch (error) {
        return false;
    }
}

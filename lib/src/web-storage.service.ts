import { StorageService } from './storage.service';

/**
 * An implementation of `StorageService` interface that uses an underlying (web) `Storage` object, such as `localStorage` and
 * `sessionStorage`, as backing data store. This class basically wraps the `Storage` object so it can be accessed through the
 * `StorageService` interface.
 */
export class WebStorageService implements StorageService {

    /**
     * Creates a new `WebStorageService` instance that uses the specified (web) storage object as underlying backing storage.
     *
     * @param storage Storage object which is to be wrapped in a class that implements the `StorageService` interface.
     */
    constructor(private readonly storage: Storage) {
    }

    /**
     * Retrieves the value stored for the entry that is associated with the specified key. If no such entry exists or if the service for
     * some reason is unable to fetch the value of the entry then `null` will be returned.
     *
     * @param   key Identifier of the entry whose value is to be retrieved.
     * @returns     Value of the entry that is identified by the specified key or `null` if the entry does not exist or cannot be loaded.
     */
    public get(key: string): any {
        try {
            const value = this.storage.getItem(key);

            return value !== null ? JSON.parse(value) : null;
        } catch (error) {
            return null;
        }
    }

    /**
     * Creates or updates the entry identified by the specified key with the given value. Storing a value into the storage service will
     * ensure that an equivalent of the value can be read back, i.e. the data and structure of the value will be the same. It, however, does
     * not necessarily return the same value, i.e. the same reference.
     *
     * @param key   Identifier of the entry which is to be created or updated.
     * @param value Value which is to be stored.
     */
    public set(key: string, value: any): void {
        this.storage.setItem(key, JSON.stringify(value));
    }

    /**
     * Removes the entry that is identified by the specified key. Attempting to remove an entry for an unknown key will have no effect.
     * Attempting to retrieve an entry via the `get` method after it has been removed will result in `null`.
     *
     * @param key Identifier of the entry which is to be removed.
     */
    public remove(key: string): void {
        this.storage.removeItem(key);
    }

}

/**
 * Checks whether the specified (web) storage is available and functional. This might not be the case for older browsers. However even
 * certain browsers that do support the web storage API can, under some circumstances, have non functional storage objects. For example,
 * Safari is known to have `localStorage` and `sessionStorage` throw exceptions in private mode.
 *
 * @param storage Storage object which is to be tested for availability.
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

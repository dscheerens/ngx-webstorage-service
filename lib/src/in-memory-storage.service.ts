import { BaseStorageService } from './base-storage.service';
import { StorageTranscoders } from './storage-transcoders';

/**
 * A volatile `StorageService` implementation. This service guarantees that data stored will remain available as long as the application
 * instance is active. After the application is terminated all data will be lost.
 */
export class InMemoryStorageService extends BaseStorageService<any> {

    /** A map that serves as the underlying backing storage for this service. */
    private readonly storage: Map<string, string> = new Map<string, string>();

    /**
     * Creates a new `InMemoryStorageService` instance.
     */
    constructor() {
        super(StorageTranscoders.JSON);
    }

    /**
     * Checks whether an entry with the specified key exists in the storage.
     *
     * @param   key Identifier of the entry for which its presence in the storage is to be checked.
     * @returns     `true` if an entry with the specified key exists in the storage, `false` if not.
     */
    public has(key: string): boolean {
        return this.storage.has(key);
    }

    /**
     * Removes the entry that is identified by the specified key. Attempting to remove an entry for an unknown key will have no effect.
     * Attempting to retrieve an entry via the `get` method after it has been removed will result in `undefined`.
     *
     * @param key Identifier of the entry which is to be removed.
     */
    public remove(key: string): void {
        this.storage.delete(key);
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
        if (!this.storage.has(key)) {
            return undefined;
        }

        return this.storage.get(key)!;
    }

    /**
     * Stores the provided value using specified key in the storage.
     *
     * @param key   Identifier of the entry for which the value is to be stored.
     * @param value The value that is to be stored.
     */
    protected setItem(key: string, value: string): void {
        this.storage.set(key, value);
    }

}

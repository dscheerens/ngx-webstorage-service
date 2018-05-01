import { StorageService } from './storage.service';
import { StorageDecoder, StorageEncoder, StorageTranscoder } from './storage-transcoder';
import { ProxyStorageService } from './proxy-storage.service';

/**
 * Base implementation for storage services.
 */
export abstract class BaseStorageService<T> implements StorageService<T> {

    /**
     * Creates a new `BaseStorageService` that uses the specified transcoder by default for read and write operations.
     *
     * @param defaultTranscoder Transcoder which is to be used by default for storage read and write operations.
     */
    constructor(private readonly defaultTranscoder: StorageTranscoder<T>) {
    }

    /**
     * Checks whether an entry with the specified key exists in the storage.
     *
     * @param   key Identifier of the entry for which its presence in the storage is to be checked.
     * @returns     `true` if an entry with the specified key exists in the storage, `false` if not.
     */
    public abstract has(key: string): boolean;

    /**
     * Retrieves the value stored for the entry that is associated with the specified key. The given decoder is used to convert the stored
     * value to the desired type. If no entry for the specified key exists or if the decoder is unable to decode the stored value, then
     * `undefined` will be returned.
     *
     * @param   key     Identifier of the entry whose value is to be retrieved.
     * @param   decoder Decoder to use for converting the stored value to the desired return type.
     * @returns         Value of the entry that is identified by the specified key. In case the entry does not exist or if it cannot be
     *                  loaded (due to a decoding issue), then `undefined` will be returned by this function.
     */
    public get(key: string, decoder?: StorageDecoder<any>): any {
        const value = this.getItem(key);

        return value !== undefined ? (decoder || this.defaultTranscoder).decode(value) : undefined;
    }

    /**
     * Creates or updates the entry identified by the specified key with the given value. The specified encoder is used to convert the given
     * value into a format that can be stored by the storage service's underlying storage.
     *
     * Storing a value into the storage service will ensure that an equivalent of the value can be read back, i.e. the data and structure of
     * the value will be the same. It, however, does not necessarily return the same reference.
     *
     * @param key     Identifier of the entry which is to be created or updated.
     * @param value   Value which is to be stored.
     * @param encoder Encoder used to convert the given value into a format that can be used for storage.
     */
    public set(key: string, value: any, encoder?: StorageEncoder<any>): void {
        this.setItem(key, (encoder || this.defaultTranscoder).encode(value));
    }

    /**
     * Removes the entry that is identified by the specified key. Attempting to remove an entry for an unknown key will have no effect.
     * Attempting to retrieve an entry via the `get` method after it has been removed will result in `undefined`.
     *
     * @param key Identifier of the entry which is to be removed.
     */
    public abstract remove(key: string): void;

    /**
     * Clears the storage by removing all entries. Subsequent `get(x)` calls for a key *x* will return `undefined`, until a new value is set
     * for key *x*.
     */
    public abstract clear(): void;

    /**
     * Creates a new storage service that uses the specified transcoder by default for read and write operations. The new storage service
     * uses the storage service on which this function is invoked as underlying storage. Both storage services will thus be able to access
     * the same data.
     *
     * The default transcoder will not be changed for the storage service on which this function is invoked.
     *
     * @param   transcoder Transcoder that should be used by default for read and write operations by the new storage service.
     * @returns            A new storage service that uses the specified transcoder by default.
     */
    public withDefaultTranscoder<X>(transcoder: StorageTranscoder<X>): StorageService<X> {
        return new ProxyStorageService(transcoder, this);
    }

    /**
     * Performs the actual retrieval of a value from storage.
     *
     * @param   key Identifier of the entry whose value is to be retrieved.
     * @returns     The value that is stored for the specified entry or `undefined` if no entry exists for the specified key.
     */
    protected abstract getItem(key: string): string | undefined;

    /**
     * Stores the provided value using specified key in the storage.
     *
     * @param key   Identifier of the entry for which the value is to be stored.
     * @param value The value that is to be stored.
     */
    protected abstract setItem(key: string, value: string): void;

}

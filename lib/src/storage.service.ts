import { StorageDecoder, StorageEncoder, StorageTranscoder } from './storage-transcoder';

/**
 * Interface for objects that can be used to store data. The service is expected to store any kind of data that can be encoded as a string.
 *
 * The `StorageService` interface is parameterized on `T` which represents the type of objects which can be read and written.
 */
export interface StorageService<T = any> { // eslint-disable-line @typescript-eslint/no-explicit-any

    /**
     * Checks whether an entry with the specified key exists in the storage.
     *
     * @param   key Identifier of the entry for which its presence in the storage is to be checked.
     * @returns     `true` if an entry with the specified key exists in the storage, `false` if not.
     */
    has(key: string): boolean;

    /**
     * Retrieves the value stored for the entry that is associated with the specified key. If no such entry exists or if the service for
     * some reason is unable to fetch the value of the entry then `undefined` will be returned.
     *
     * @param   key Identifier of the entry whose value is to be retrieved.
     * @returns     Value of the entry that is identified by the specified key. In case the entry does not exist or if it cannot be loaded
     *              (due to a decoding issue), then `undefined` will be returned by this function.
     */
    get(key: string): T | undefined;

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
    get<X>(key: string, decoder: StorageDecoder<X>): X | undefined;

    /**
     * Creates or updates the entry identified by the specified key with the given value. Storing a value into the storage service will
     * ensure that an equivalent of the value can be read back, i.e. the data and structure of the value will be the same. It, however, does
     * not necessarily return the same reference.
     *
     * @param key   Identifier of the entry which is to be created or updated.
     * @param value Value which is to be stored.
     */
    set(key: string, value: T): void;

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
    set<X>(key: string, value: X, encoder: StorageEncoder<X>): void;

    /**
     * Removes the entry that is identified by the specified key. Attempting to remove an entry for an unknown key will have no effect.
     * Attempting to retrieve an entry via the `get` method after it has been removed will result in `undefined`.
     *
     * @param key Identifier of the entry which is to be removed.
     */
    remove(key: string): void;

    /**
     * Clears the storage by removing all entries. Subsequent `get(x)` calls for a key *x* will return `undefined`, until a new value is set
     * for key *x*.
     */
    clear(): void;

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
    withDefaultTranscoder<X>(transcoder: StorageTranscoder<X>): StorageService<X>;

}

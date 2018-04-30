import { StorageService } from './storage.service';
import { StorageTranscoder, StorageDecoder, StorageEncoder } from './storage-transcoder';

/**
 * A storage service implementation that is used as a proxy for another storage service. This is used to create storage services with a
 * different default transcoder.
 */
export class ProxyStorageService<T> implements StorageService<T> {

    /**
     * Creates a new `ProxyStorageService` instance that uses the specified transcoder by default for read and write operations. Actual
     * read and writes are delegated to given storage service.
     *
     * @param defaultTranscoder Transcoder which is to be used by default for storage read and write operations.
     * @param subject           Storage service which should handle to actual storage of data.
     */
    constructor(
        private readonly defaultTranscoder: StorageTranscoder<T>,
        private readonly subject: StorageService
    ) { }

    /*
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
        return this.subject.get(key, decoder || this.defaultTranscoder);
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
        this.subject.set(key, value, encoder || this.defaultTranscoder);
    }

    /**
     * Removes the entry that is identified by the specified key. Attempting to remove an entry for an unknown key will have no effect.
     * Attempting to retrieve an entry via the `get` method after it has been removed will result in `undefined`.
     *
     * @param key Identifier of the entry which is to be removed.
     */
    public remove(key: string): void {
        this.subject.remove(key);
    }

    /**
     * Clears the storage by removing all entries. Subsequent `get(x)` calls for a key *x* will return `undefined`, until a new value is set
     * for key *x*.
     */
    public clear(): void {
        this.subject.clear();
    }

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
        return new ProxyStorageService(transcoder, this.subject);
    }
}

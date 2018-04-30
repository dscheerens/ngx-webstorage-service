/**
 * Interface used for objects that can encode values of type `T` for (persistent) storage as strings.
 */
export interface StorageEncoder<T> {

    /**
     * Encodes the specified value in a string that can be used for (persistent) storage of the value.
     *
     * @param  value The value which is to be encoded.
     * @return       A string representation of the specified value.
     */
    encode(value: T): string;
}

/**
 * Interface used for objects that can decode values which as stored as string into values of type `T`.
 */
export interface StorageDecoder<T> {

    /**
     * Decodes the specified value.
     *
     * @param   value The value which is to be decoded.
     * @returns       Decoded value or `undefined` if the value cannot be decoded.
     */
    decode(value: string): T | undefined;
}

/**
 * Interface for objects that can encode values of type `T` to `string` and decode `string` values as instances of type `T`.
 */
export type StorageTranscoder<T> = StorageEncoder<T> & StorageDecoder<T>;

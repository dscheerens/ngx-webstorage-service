import { StorageTranscoder } from './storage-transcoder';

/** Transcoder that encodes values as JSON strings. */
export class JsonStorageTranscoder implements StorageTranscoder<any> {

    public encode(value: any): string {
        return JSON.stringify(value);
    }

    public decode(value: string): any {
        try {
            return JSON.parse(value);
        } catch (error) {
            return undefined;
        }
    }

}

/** Transcoder that encodes/decodes strings **as is**, i.e. values are not modified in any way. */
export class StringStorageTranscoder implements StorageTranscoder<string> {
    public encode(value: string): string {
        return value;
    }

    public decode(value: string): string {
        return value;
    }
}

/** Transcoder that encodes/decodes `boolean` values. */
export class BooleanStorageTranscoder implements StorageTranscoder<boolean> {
    public encode(value: boolean): string {
        return value.toString();
    }

    public decode(value: string): boolean | undefined {
        if (value === 'true') {
            return true;
        }
        if (value === 'false') {
            return false;
        }

        return undefined;
    }
}

/** Transcoder that encodes/decodes `number` values. */
export class NumberStorageTranscoder implements StorageTranscoder<number> {
    public encode(value: number): string {
        return value.toString();
    }

    public decode(value: string): number | undefined {
        const parsedNumber = Number(value);

        return Number.isFinite(parsedNumber) ? parsedNumber : undefined;
    }
}

/** A set of storage transcoders. */
export const StorageTranscoders = {
    /** Transcoder that encodes values as JSON strings. */
    JSON: new JsonStorageTranscoder() as StorageTranscoder<any>,

    /** Transcoder that encodes/decodes strings **as is**, i.e. values are not modified in any way. */
    STRING: new StringStorageTranscoder() as StorageTranscoder<string>,

    /** Transcoder that encodes/decodes `boolean` values. */
    BOOLEAN: new BooleanStorageTranscoder() as StorageTranscoder<boolean>,

    /** Transcoder that encodes/decodes `number` values. */
    NUMBER: new NumberStorageTranscoder() as StorageTranscoder<number>
};

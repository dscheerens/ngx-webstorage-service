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

/** Transcoder that encodes/decodes `Date` values to ISO strings. */
export class DateIsoStorageTranscoder implements StorageTranscoder<Date> {
    public encode(value: Date): string {
        return value.toISOString();
    }

    public decode(value: string): Date | undefined {
        const timestamp = Date.parse(value);

        return isNaN(timestamp) ? undefined : new Date(timestamp);
    }
}

/** Transcoder that encodes/decodes `Date` values to epoch timestamps. */
export class DateEpochStorageTranscoder implements StorageTranscoder<Date> {
    public encode(value: Date): string {
        return value.valueOf().toString();
    }

    public decode(value: string): Date | undefined {
        const timestamp = parseInt(value, 10);

        return isNaN(timestamp) ? undefined : new Date(timestamp);
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
    NUMBER: new NumberStorageTranscoder() as StorageTranscoder<number>,

    /** Transcoder that encodes/decodes `Date` values into ISO strings. */
    DATE_ISO_STRING: new DateIsoStorageTranscoder() as StorageTranscoder<Date>,

    /** Transcoder that encodes/decodes `Date` values into epoch timestamps. */
    DATE_EPOCH_TIME: new DateEpochStorageTranscoder() as StorageTranscoder<Date>,
};

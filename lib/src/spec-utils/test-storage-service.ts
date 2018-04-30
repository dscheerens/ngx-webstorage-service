import { StorageService } from '../storage.service';
import { StorageTranscoders } from '../storage-transcoders';

export function testStorageService(
    storageServiceFactory: () => StorageService,
    prepareFaultyEntry?: (entryKey: string) => void
): () => void {

    return () => {
        let storageService: StorageService;

        beforeEach(() => storageService = storageServiceFactory());

        it('can write values and read them back', () => {
            storageService.set('key-a', 'foo');
            expect(storageService.get('key-a')).toBe('foo');
            storageService.set('key-b', 'bar');
            storageService.set('key-c', 'baz');
            expect(storageService.get('key-b')).toBe('bar');
            expect(storageService.get('key-c')).toBe('baz');
        });

        it('can overwrite values for existing entries', () => {
            storageService.set('key-a', 'apple');
            expect(storageService.get('key-a')).toBe('apple');
            storageService.set('key-a', 'banana');
            expect(storageService.get('key-a')).toBe('banana');
            storageService.set('key-a', 'cucumber');
            expect(storageService.get('key-a')).toBe('cucumber');
        });

        it('supports repeatable reads', () => {
            storageService.set('key-a', 'first');
            expect(storageService.get('key-a')).toBe('first');
            expect(storageService.get('key-a')).toBe('first');
            expect(storageService.get('key-a')).toBe('first');
            storageService.set('key-a', 'second');
            expect(storageService.get('key-a')).toBe('second');
            expect(storageService.get('key-a')).toBe('second');
            expect(storageService.get('key-a')).toBe('second');
        });

        it('returns undefined when attempting to fetch an entry for an unknown key', () => {
            expect(storageService.get('non-existing-key')).toBeUndefined();
            expect(storageService.get('bogus')).toBeUndefined();
            expect(storageService.get('!undefined')).toBeUndefined();
        });

        it('returns undefined for removed entries', () => {
            storageService.set('test-phrase', 'testing 1, 2, 3...');
            expect(storageService.get('test-phrase')).toBe('testing 1, 2, 3...');
            storageService.remove('test-phrase');
            expect(storageService.get('test-phrase')).toBeUndefined();
        });

        it('can clear the storage', () => {
            storageService.set('foo', 1);
            storageService.set('bar', true);
            storageService.set('baz', { yolo: 'forever! :D' });

            expect(storageService.get('foo')).toEqual(1);
            expect(storageService.get('bar')).toEqual(true);
            expect(storageService.get('baz')).toEqual({ yolo: 'forever! :D' });

            storageService.clear();

            expect(storageService.get('foo')).toBeUndefined();
            expect(storageService.get('bar')).toBeUndefined();
            expect(storageService.get('baz')).toBeUndefined();
        });

        it('supports changing to a different default transcoder', () => {
            const stringStorageService = storageService.withDefaultTranscoder(StorageTranscoders.STRING);
            const numberStorageService = stringStorageService.withDefaultTranscoder(StorageTranscoders.NUMBER);
            const booleanStorageService = storageService.withDefaultTranscoder(StorageTranscoders.BOOLEAN);

            expect(stringStorageService.get('test')).toBeUndefined();

            stringStorageService.set('test', 'hey, this is a string!');

            expect(stringStorageService.get('test')).toEqual('hey, this is a string!');
            expect(numberStorageService.get('test')).toBeUndefined();
            expect(booleanStorageService.get('test')).toBeUndefined();

            booleanStorageService.set('boolean-test', false);
            expect(booleanStorageService.get('boolean-test')).toBe(false);
            expect(numberStorageService.get('boolean')).toBeUndefined();

            numberStorageService.set('number-test', -3.13e-37);
            expect(numberStorageService.get('number-test')).toBe(-3.13e-37);
        });

        if (prepareFaultyEntry) {
            it('returns undefined for entries with a faulty value', () => {
                storageService.set('bad-entry', 'so far so good...');
                expect(storageService.get('bad-entry')).toBe('so far so good...');

                prepareFaultyEntry('bad-entry');
                expect(storageService.get('bad-entry')).toBeUndefined();
            });
        }
    };

}

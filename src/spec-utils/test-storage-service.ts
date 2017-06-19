import { StorageService } from '../storage.service';

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

        it('returns null when attempting to fetch an entry for an unknown key', () => {
            expect(storageService.get('non-existing-key')).toBeNull();
            expect(storageService.get('bogus')).toBeNull();
            expect(storageService.get('!null')).toBeNull();
        });

        it('returns null for removed entries', () => {
            storageService.set('test-phrase', 'testing 1, 2, 3...');
            expect(storageService.get('test-phrase')).toBe('testing 1, 2, 3...');
            storageService.remove('test-phrase');
            expect(storageService.get('test-phrase')).toBeNull();
        });

        if (prepareFaultyEntry) {
            it('returns null for entries with a faulty value', () => {
                storageService.set('bad-entry', 'so far so good...');
                expect(storageService.get('bad-entry')).toBe('so far so good...');

                prepareFaultyEntry('bad-entry');
                expect(storageService.get('bad-entry')).toBeNull();
            });
        }
    };

}

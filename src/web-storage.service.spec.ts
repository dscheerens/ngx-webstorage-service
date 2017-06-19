import { testStorageService } from './spec-utils/test-storage-service';
import { isStorageAvailable, WebStorageService } from './web-storage.service';

describe('web storage service for `localStorage`', testStorageService(
    () => new WebStorageService(localStorage),
    (key: string) => localStorage.setItem(key, 'boom!')
));

describe('web storage service for `sessionStorage`', testStorageService(
    () => new WebStorageService(sessionStorage),
    (key: string) => sessionStorage.setItem(key, 'boom!')
));

describe('isStorageAvailable() function', () => {

    it('returns false when the provided storage is either null or undefined', () => {
        expect(isStorageAvailable(null)).toBe(false);
        expect(isStorageAvailable(undefined)).toBe(false);
    });

    it('returns false for non Storage objects', () => {
        expect(isStorageAvailable(<any> {})).toBe(false);
        expect(isStorageAvailable(<any> '')).toBe(false);
    });

    it('returns false for faulty Storage objects', () => {
        expect(isStorageAvailable(<any> {
            setItem() { throw new Error('Oops, not supported!'); }
        })).toBe(false);

        expect(isStorageAvailable(<any> {
            setItem() { /* no-op. */ }
        })).toBe(false);

        expect(isStorageAvailable(<any> {
            setItem() { /* no-op. */ },
            getItem(): string { return null; }
        })).toBe(false);

        expect(isStorageAvailable(<any> {
            setItem() { /* no-op. */ },
            getItem(): string { throw new Error('Oops, not supported!'); }
        })).toBe(false);
    });

    it('returns true for localStorage, provided that is supported by the browser running this test', () => {
        expect(isStorageAvailable(localStorage)).toBe(true);
    });

    it('returns true for sessionStorage, provided that is supported by the browser running this test', () => {
        expect(isStorageAvailable(sessionStorage)).toBe(true);
    });

});

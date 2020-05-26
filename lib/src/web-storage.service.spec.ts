import { testStorageService } from './spec-utils/test-storage-service';
import { WebStorageService, isLocalStorageAvailable, isSessionStorageAvailable, isStorageAvailable } from './web-storage.service';

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
        expect(isStorageAvailable(null!)).toBe(false);
        expect(isStorageAvailable(undefined!)).toBe(false);
    });

    it('returns false for non Storage objects', () => {
        expect(isStorageAvailable(<any> {})).toBe(false);
        expect(isStorageAvailable(<any> '')).toBe(false);
    });

    it('returns false for faulty Storage objects', () => {
        expect(isStorageAvailable(<any> {
            setItem(): void { throw new Error('Oops, not supported!'); }
        })).toBe(false);

        expect(isStorageAvailable(<any> {
            setItem(): void { }
        })).toBe(false);

        expect(isStorageAvailable(<any> {
            setItem(): void { },
            getItem(): string { return null!; }
        })).toBe(false);

        expect(isStorageAvailable(<any> {
            setItem(): void { },
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

const originalSessionStorageDescriptor = Object.getOwnPropertyDescriptor(window, 'sessionStorage')!;

describe('isSessionStorageAvailable() function', () => {

    afterEach(() => Object.defineProperty(window, 'sessionStorage', originalSessionStorageDescriptor));

    it('returns false if the sessionStorage property does not exist on the window object', () => {
        Object.defineProperty(window, 'sessionStorage', { get: () => undefined });

        expect(isSessionStorageAvailable()).toBe(false);
    });

    it('returns false when accessing the sessionStorage property throws an error', () => {
        Object.defineProperty(window, 'sessionStorage', { get: () => { throw new Error('Access denied!'); } });

        expect(isSessionStorageAvailable()).toBe(false);
    });

    it('returns true for normal conditions', () => {
        expect(isSessionStorageAvailable()).toBe(true);
    });

});

const originalLocalStorageDescriptor = Object.getOwnPropertyDescriptor(window, 'localStorage')!;

describe('isLocalStorageAvailable() function', () => {

    afterEach(() => Object.defineProperty(window, 'localStorage', originalLocalStorageDescriptor));

    it('returns false if the localStorage property does not exist on the window object', () => {
        Object.defineProperty(window, 'localStorage', { get: () => undefined });

        expect(isLocalStorageAvailable()).toBe(false);
    });

    it('returns false when accessing the localStorage property throws an error', () => {
        Object.defineProperty(window, 'localStorage', { get: () => { throw new Error('Access denied!'); } });

        expect(isLocalStorageAvailable()).toBe(false);
    });

    it('returns true for normal conditions', () => {
        expect(isLocalStorageAvailable()).toBe(true);
    });

});

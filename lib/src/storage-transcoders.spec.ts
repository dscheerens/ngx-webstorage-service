import { StorageTranscoders } from './storage-transcoders';

describe('JSON storage transcoder', () => {

    const transcoder = StorageTranscoders.JSON;

    it('correctly encodes values', () => {
        expect(transcoder.encode(null)).toBe('null');
        expect(transcoder.encode(123.45)).toBe('123.45');
        expect(transcoder.encode('a string')).toBe('"a string"');
        expect(transcoder.encode([1, 2, 'a', 3, 'b'])).toBe('[1,2,"a",3,"b"]');
        expect(transcoder.encode({ foo: null, bar: { beer: true }, baz: 'dunno' })).toBe('{"foo":null,"bar":{"beer":true},"baz":"dunno"}');
    });

    it('correctly decodes values', () => {
        expect(transcoder.decode('null')).toBe(null);
        expect(transcoder.decode('123.45')).toBe(123.45);
        expect(transcoder.decode('"a string"')).toBe('a string');
        expect(transcoder.decode('[1,2,"a",3,"b"]')).toEqual([1, 2, 'a', 3, 'b']);
        expect(transcoder.decode('{"foo":null,"bar":{"beer":true},"baz":"dunno"}'))
            .toEqual({ foo: null, bar: { beer: true }, baz: 'dunno' });
        expect(transcoder.decode('a-very-much-incorrect-json-string')).toBe(undefined);
    });

});

describe('string storage transcoder', () => {

    const transcoder = StorageTranscoders.STRING;

    it('correctly encodes values', () => {
        expect(transcoder.encode('can-be-any-string')).toBe('can-be-any-string');
        expect(transcoder.encode('<{we1rd " charact3r$ \' 4nd s7uff!!!')).toBe('<{we1rd " charact3r$ \' 4nd s7uff!!!');
        expect(transcoder.encode('')).toBe('');
    });

    it('correctly decodes values', () => {
        expect(transcoder.decode('can-be-any-string')).toBe('can-be-any-string');
        expect(transcoder.decode('<{we1rd " charact3r$ \' 4nd s7uff!!!')).toBe('<{we1rd " charact3r$ \' 4nd s7uff!!!');
        expect(transcoder.decode('')).toBe('');
    });

});

describe('boolean storage transcoder', () => {

    const transcoder = StorageTranscoders.BOOLEAN;

    it('correctly encodes values', () => {
        expect(transcoder.encode(true)).toBe('true');
        expect(transcoder.encode(false)).toBe('false');
    });

    it('correctly decodes values', () => {
        expect(transcoder.decode('true')).toBe(true);
        expect(transcoder.decode('false')).toBe(false);
        expect(transcoder.decode('oops')).toBe(undefined);
        expect(transcoder.decode('')).toBe(undefined);
        expect(transcoder.decode('1')).toBe(undefined);
    });

});

describe('number storage transcoder', () => {

    const transcoder = StorageTranscoders.NUMBER;

    it('correctly encodes values', () => {
        expect(transcoder.encode(0)).toBe('0');
        expect(transcoder.encode(1)).toBe('1');
        expect(transcoder.encode(13.37)).toBe('13.37');
        expect(transcoder.encode(-1.2e-34).toLowerCase()).toBe('-1.2e-34');
    });

    it('correctly decodes values', () => {
        expect(transcoder.decode('0')).toBe(0);
        expect(transcoder.decode('1')).toBe(1);
        expect(transcoder.decode('13.37')).toBe(13.37);
        expect(transcoder.decode('-1.2E-34')).toBe(-1.2e-34);
        expect(transcoder.decode('not really a number')).toBe(undefined);
        expect(transcoder.decode('1x1')).toBe(undefined);
    });

});

describe('date iso storage transcoder', () => {

    const transcoder = StorageTranscoders.DATE_ISO_STRING;

    it('correctly encodes values', () => {
        const now = new Date();
        expect(transcoder.encode(new Date('2019-08-26T15:18:05.822Z'))).toBe('2019-08-26T15:18:05.822Z');
        expect(transcoder.encode(now)).toBe(now.toISOString());
    });

    it('correctly decodes values', () => {
        expect(transcoder.decode('2019-08-26T15:18:05.822Z')).toEqual(new Date('2019-08-26T15:18:05.822Z'));
        expect(transcoder.decode('invalid')).toBe(undefined);
        expect(transcoder.decode('')).toBe(undefined);
    });

});

describe('date epoch storage transcoder', () => {

    const transcoder = StorageTranscoders.DATE_EPOCH_TIME;

    it('correctly encodes values', () => {
        const now = new Date();
        expect(transcoder.encode(new Date('2019-08-26T15:18:05.822Z'))).toBe('1566832685822');
        expect(transcoder.encode(now)).toBe(now.valueOf().toString());
    });

    it('correctly decodes values', () => {
        expect(transcoder.decode('1566832685822')).toEqual(new Date('2019-08-26T15:18:05.822Z'));
        expect(transcoder.decode('invalid')).toBe(undefined);
        expect(transcoder.decode('')).toBe(undefined);
    });

});

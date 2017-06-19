import { readFileSync } from 'fs';

export const TYPESCRIPT_HELPER_FUNCTIONS = {
    esm: readFileSync(`${__dirname}/../static/ts-helpers.src.esm.js`, 'UTF8'),
    umd: readFileSync(`${__dirname}/../static/ts-helpers.src.umd.js`, 'UTF8')
};

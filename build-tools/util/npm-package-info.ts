import { readFileSync } from 'fs';

interface NpmPackageInfo {
    name: string;
}

export const NPM_PACKAGE_INFO: NpmPackageInfo = JSON.parse(readFileSync('./package.json', 'UTF8'));

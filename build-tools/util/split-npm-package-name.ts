const SCOPED_NPM_PACKAGE_NAME_REGEXP = /^@(.+)\/(.+)$/;

export function splitNpmPackageName(npmPackageName: string): { scope?: string, moduleName: string } {
    const scopeMatch = npmPackageName.match(SCOPED_NPM_PACKAGE_NAME_REGEXP);
    if (scopeMatch) {
        return {
            scope: scopeMatch[1],
            moduleName: scopeMatch[2]
        };
    }
    return { moduleName: npmPackageName };
}

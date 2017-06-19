export type RollupGlobalsMap = { [key: string]: string };

export type RollupGlobalsResolver = (key: string) => string;

export function convertRollupGlobalsMapToResolver(globals: RollupGlobalsMap): RollupGlobalsResolver {
    return (key: string) => {
        if (!globals.hasOwnProperty(key)) {
            return null;
        }
        return globals[key];
    };
}

export function combineRollupGlobals(...globalsSet: (RollupGlobalsMap | RollupGlobalsResolver)[]): RollupGlobalsResolver {
    const resolvers = globalsSet.map((globals) => {
        if (typeof globals === 'object') {
            return convertRollupGlobalsMapToResolver(globals);
        } else {
            return globals;
        }
    });

    return (key: string) => resolvers.reduce((resolved, resolver) => resolved !== null ? resolved : resolver(key), <string> null);
}

export function globalsResolverToExternalResolver(resolver: RollupGlobalsResolver): (key: string) => boolean {
    return (key: string) => resolver(key) !== null;
}

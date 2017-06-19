import { combineRollupGlobals, RollupGlobalsMap, RollupGlobalsResolver } from './rollupjs-util';
import { SystemjsConfigMap, SystemjsConfigPackages, SystemjsConfigPaths } from './systemjs-config';

export interface SystemjsModuleConfig {
    map?: SystemjsConfigMap;
    paths?: SystemjsConfigPaths;
    packages?: SystemjsConfigPackages;
}

export type KarmaFileInclude = (string | { pattern: string, included?: boolean });

export interface ModuleConfig {
    moduleName: string;
    systemjs?: SystemjsModuleConfig;
    rollupGlobals?: RollupGlobalsMap | RollupGlobalsResolver;
    karmaFiles?: KarmaFileInclude[];
}

export interface ProjectConfigOptions {
    /** Name of the module should be in kebab-case, e.g. "my-module" (defaults to the name property in package.json). */
    moduleName?: string;

    /** Path to the root directory of the project. */
    basePath?: string;

    /** Path to the directory that contains the module sources. */
    srcPath?: string;

    /** Path to the directory in which the builds are stored. */
    buildPath?: string;

    /** Path to the directory in which the distribution builds are stored. */
    distPath?: string;

    /** Path to the directory in which the test builds are stored. */
    testBuildPath?: string;

    /** Name of the systemjs configuration file. */
    systemjsConfigFile?: string;

    /** Configuration (systemjs, karma, rollup) for additional dependencies. */
    modules?: ModuleConfig[];

    /** Glob patterns for static files that need to be copied to the distribution build folder. */
    staticFiles?: ((basePath: string) => string)[];
}

export class ProjectConfig implements ProjectConfigOptions {
    public moduleName: string;
    public basePath: string;
    public srcPath: string;
    public buildPath: string;
    public distPath: string;
    public testBuildPath: string;
    public systemjsConfigFile: string;
    public modules: ModuleConfig[];
    public staticFiles: ((basePath: string) => string)[];

    constructor(options: ProjectConfigOptions) {
        this.moduleName = options.moduleName;
        this.basePath = options.basePath;
        this.srcPath = options.srcPath;
        this.buildPath = options.buildPath;
        this.distPath = options.distPath;
        this.testBuildPath = options.testBuildPath;
        this.systemjsConfigFile = options.systemjsConfigFile;
        this.modules = options.modules;
        this.staticFiles = options.staticFiles;
    }

    public merge(options: ProjectConfigOptions): ProjectConfig {
        return new ProjectConfig({
            moduleName: options.moduleName || this.moduleName,
            basePath: options.basePath || this.basePath,
            srcPath: options.srcPath || this.srcPath,
            buildPath: options.buildPath || this.buildPath,
            distPath: options.distPath || this.distPath,
            testBuildPath: options.testBuildPath || this.testBuildPath,
            systemjsConfigFile: options.systemjsConfigFile || this.systemjsConfigFile,
            modules: mergeModuleConfigs(this.modules, options.modules),
            staticFiles: (this.staticFiles || []).concat(options.staticFiles || [])
        });
    }

    public get rollupGlobals(): RollupGlobalsResolver {
        return combineRollupGlobals(...this.modules
            .map((module) => module.rollupGlobals)
            .filter((rollupGlobals) => !!rollupGlobals));
    }

    public get systemjsModuleConfig(): SystemjsModuleConfig {
        return this.modules
            .map((module) => module.systemjs)
            .filter((config) => !!config)
            .reduce(mergeSystemjsModuleConfig, <SystemjsModuleConfig> {});
    }

    public get karmaFiles(): KarmaFileInclude[] {
        return [].concat(...this.modules
            .map((module) => module.karmaFiles)
            .filter((karmaFiles) => !!karmaFiles));
    }

}

function mergeModuleConfigs(moduleConfigSetA?: ModuleConfig[], moduleConfigSetB?: ModuleConfig[]): ModuleConfig[] {
    if (!moduleConfigSetA) {
        return moduleConfigSetB;
    }
    if (!moduleConfigSetB) {
        return moduleConfigSetA;
    }

    function containsModule(moduleConfigSet: ModuleConfig[], moduleName: string): boolean {
        return moduleConfigSet.some((moduleConfig) => moduleConfig.moduleName === moduleName);
    }

    return moduleConfigSetA
        .map((moduleConfigA) => {
            const moduleConfigB = moduleConfigSetB.find((module) => module.moduleName === moduleConfigA.moduleName);
            if (moduleConfigB) {
                return mergeModuleConfig(moduleConfigA, moduleConfigB);
            }
            return moduleConfigA;
        })
        .concat(moduleConfigSetB.filter(({ moduleName: moduleB }) => !containsModule(moduleConfigSetA, moduleB)));
}

function mergeModuleConfig(moduleConfigA: ModuleConfig, moduleConfigB: ModuleConfig): ModuleConfig {
    const mergedConfig: ModuleConfig = {
        moduleName: moduleConfigA.moduleName
    };

    if (moduleConfigA.karmaFiles || moduleConfigB.karmaFiles) {
        mergedConfig.karmaFiles = [].concat(moduleConfigA.karmaFiles || [], moduleConfigB.karmaFiles || []);
    }

    if (moduleConfigA.rollupGlobals || moduleConfigB.rollupGlobals) {
        mergedConfig.rollupGlobals = Object.assign({}, moduleConfigA.rollupGlobals || {}, moduleConfigB.rollupGlobals || {});
    }

    if (moduleConfigA.systemjs || moduleConfigB.systemjs) {
        mergedConfig.systemjs = mergeSystemjsModuleConfig(moduleConfigA.systemjs, moduleConfigB.systemjs);
    }

    return mergedConfig;
}

export function mergeSystemjsModuleConfig(configA?: SystemjsModuleConfig, configB?: SystemjsModuleConfig): SystemjsModuleConfig {
    if (!configA) {
        return configB;
    }
    if (!configB) {
        return configA;
    }

    const mergedConfig: SystemjsModuleConfig = {};

    if (configA.map || configB.map) {
        mergedConfig.map = Object.assign({}, configA.map || {}, configB.map || {});
    }
    if (configA.paths || configB.paths) {
        mergedConfig.paths = Object.assign({}, configA.paths || {}, configB.paths || {});
    }
    if (configA.packages || configB.packages) {
        mergedConfig.packages = Object.assign({}, configA.packages || {}, configB.packages || {});
    }

    return mergedConfig;
}

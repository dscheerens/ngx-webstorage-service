import { toLowerCamelCase } from './case-strategy-convertors';
import { NPM_PACKAGE_INFO } from './npm-package-info';
import { ModuleConfig, ProjectConfig } from './project-config.model';
import { RollupGlobalsResolver } from './rollupjs-util';

const basePath = '.';
const srcPath = `${basePath}/src`;
const buildPath = `${basePath}/build`;
const distPath = `${buildPath}/dist`;
const testBuildPath = `${buildPath}/test`;

export const DEFAULT_PROJECT_CONFIG = new ProjectConfig({
    moduleName: NPM_PACKAGE_INFO.name,
    basePath,
    srcPath,
    buildPath,
    distPath,
    testBuildPath,
    systemjsConfigFile: 'systemjs.config.js',
    modules: [
        {
            moduleName: 'core-js',
            karmaFiles: [ 'node_modules/core-js/client/shim.min.js' ]
        },
        {
            moduleName: 'systemjs',
            karmaFiles: [ 'node_modules/systemjs/dist/system.src.js' ]
        },
        {
            moduleName: 'zone.js',
            karmaFiles: [
                'node_modules/zone.js/dist/zone.js',
                'node_modules/zone.js/dist/long-stack-trace-zone.js',
                'node_modules/zone.js/dist/async-test.js',
                'node_modules/zone.js/dist/fake-async-test.js',
                'node_modules/zone.js/dist/sync-test.js',
                'node_modules/zone.js/dist/proxy.js',
                'node_modules/zone.js/dist/jasmine-patch.js'
            ]
        },
        {
            moduleName: 'rxjs',
            systemjs: {
                map: {
                    rxjs: 'node_modules/rxjs'
                },
                packages: {
                    rxjs: { main: 'Rx.js', defaultExtension: 'js' }
                }
            },
            karmaFiles: [{ pattern: 'node_modules/rxjs/**/*.js', included: false }],
            rollupGlobals: rxjsRollupGlobalsResolver
        },
        angularModule('animations'),
        angularModule('common', ['testing', 'http', 'http/testing']),
        angularModule('compiler', ['testing']),
        angularModule('core', ['testing']),
        angularModule('forms'),
        angularModule('http', ['testing']),
        angularModule('platform-browser', ['animations', 'testing']),
        angularModule('platform-browser-dynamic', ['testing']),
        angularModule('router', ['testing']),
        {
            moduleName: 'tslib',
            karmaFiles: [ 'node_modules/tslib/tslib.js' ],
            systemjs: {
                map: {
                    tslib: 'node_modules/tslib'
                },
                packages: {
                    tslib: { main: 'tslib.js', defaultExtension: 'js' }
                }
            },
            rollupGlobals: { tslib: 'tslib' }
        }
    ],
    staticFiles: [
        (path: string) => `${path}/package.json`
    ]
});

function rxjsRollupGlobalsResolver(key: string): string {
    return (
        [
            { pattern: /^rxjs\/[A-Z]\w+$/, globalName: 'Rx' },
            { pattern: /^rxjs(\/add)?\/observable\/\w+$/, globalName: 'Rx.Observable' },
            { pattern: /^rxjs(\/add)?\/operator\/\w+$/, globalName: 'Rx.Observable.prototype' }
        ].reduce((result, mapping) => {
            if (result === null && mapping.pattern.test(key)) {
                return mapping.globalName;
            }
            return result;
        }, <string> null)
    );
}

function angularRollupGlobalsResolver(moduleName: string): RollupGlobalsResolver {
    return (key: string) => {
        const [scope, ...packages] = key.split('/');
        if (scope !== '@angular' || packages[0] !== moduleName) {
            return null;
        }
        return ['ng', ...packages.map(toLowerCamelCase)].join('.');
    };
}

function angularModule(moduleName: string, subpackages: string[] = []): ModuleConfig {
    const angularPackageName = `@angular/${moduleName}`;

    const moduleMap = new Map<string, string>()
        .set(angularPackageName, `node_modules/@angular/${moduleName}/bundles/${moduleName}.umd.js`);
    subpackages.forEach((subpackage) => {
        const subpackageName = `${angularPackageName}/${subpackage}`;
        moduleMap.set(subpackageName, `node_modules/@angular/${moduleName}/bundles/${moduleName}-${subpackage.replace(/\//g, '-')}.umd.js`);
    });

    const systemjsPaths: { [key: string]: string } = {};
    const karmaFilePatterns: string[] = [];

    moduleMap.forEach((bundleFile, packageName) => {
        systemjsPaths[packageName] = bundleFile;
        karmaFilePatterns.push(bundleFile);
    });

    return {
        moduleName: angularPackageName,
        systemjs: { paths: systemjsPaths },
        karmaFiles: karmaFilePatterns.map((pattern) => ({ pattern, included: false })),
        rollupGlobals: angularRollupGlobalsResolver(moduleName)
    };
}

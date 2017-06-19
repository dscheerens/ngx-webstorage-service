import { AngularCompilerOptions, CodeGenerator, main as ngc, NgcCliOptions } from '@angular/compiler-cli';
import * as ciInfo from 'ci-info';
import { writeFile } from 'fs';
import * as gulp from 'gulp';
import * as inlineTemplate from 'gulp-inline-ng2-template';
import * as jsonTransform from 'gulp-json-transform';
import tslint from 'gulp-tslint';
import * as nodeSass from 'node-sass';
import * as rimraf from 'rimraf';
import { rollup } from 'rollup';
import * as runSequence from 'run-sequence';
import * as ts from 'typescript';

import { PROJECT_CONFIG as projectConfig } from './config/project.config';
import { toLowerCamelCase } from './util/case-strategy-convertors';
import { ExtendedKarmaConfig, karmaConstants } from './util/karma-config.model';
import { mergeSystemjsModuleConfig } from './util/project-config.model';
import { globalsResolverToExternalResolver } from './util/rollupjs-util';
import { runKarma } from './util/run-karma';
import { splitNpmPackageName } from './util/split-npm-package-name';
import { TYPESCRIPT_HELPER_FUNCTIONS as typescriptHelperFunctions } from './util/ts-helpers';

gulp.task('default', ['build.dist']);

gulp.task('build.dist', (done: DoneCallback) => runSequence(
    'tslint.src',
    'clean.dist.pre',
    ['copy.tsconfig.dist', 'copy.ts.dist'],
    'generate-module-index.dist',
    'ngc+rollup.dist.es6',
    'ngc+rollup.dist.es5',
    'patch-metadata.dist',
    'clean.dist.post',
    'copy.static.dist',
    done
));

gulp.task('tslint.src', () => {
    return gulp.src(`${projectConfig.srcPath}/**/*.ts`)
        .pipe(tslint())
        .pipe(tslint.report({
            emitError: true
        }));
});

gulp.task('clean.dist.pre', (done: DoneCallback) => {
    rimraf(projectConfig.distPath, done);
});

gulp.task('copy.tsconfig.dist', (done: DoneCallback) => {
    gulp.src(`${projectConfig.srcPath}/tsconfig.json`)
        .pipe(gulp.dest(projectConfig.distPath))
        .on('end', () => done());
});

function copySourceTask(source: string | string[], destinationPath: string) {
    return (done: DoneCallback) => {
        gulp.src(source)
            .pipe(inlineTemplate({
                base: projectConfig.srcPath,
                useRelativePaths: true,
                removeLineBreaks: true,
                styleProcessor: (file, ext, fileContents, styleProcessorDone) => {
                    nodeSass.render({
                        file,
                        outputStyle: 'compressed'
                    }, (error, result) => styleProcessorDone(error, result && result.css));
                }
            }))
            .pipe(gulp.dest(destinationPath))
            .on('end', () => done());
    };
}

gulp.task('copy.ts.dist', copySourceTask(
    [
        `${projectConfig.srcPath}/**/!(*.spec).ts`,
        `!${projectConfig.srcPath}/spec-utils/*`
    ],
    `${projectConfig.distPath}/src`));

gulp.task('generate-module-index.dist', (done: DoneCallback) => {
    writeFile(`${projectConfig.distPath}/index.ts`, 'export * from \'./src/index\';', done);
});

gulp.task('ngc+rollup.dist.es5', (done: DoneCallback) =>
    runSequence('ngc.dist.es5', ['rollup.dist.es5.umd', 'rollup.dist.es5.esm'], done));

gulp.task('ngc+rollup.dist.es6', (done: DoneCallback) =>
    runSequence('ngc.dist.es6', 'rollup.dist.es6', done));

function codegen(ngOptions: AngularCompilerOptions, cliOptions: NgcCliOptions, program: ts.Program, host: ts.CompilerHost) {
    return CodeGenerator.create(ngOptions, cliOptions, program, host).codegen();
}

function ngcTask(sourceDirectory: string, target: 'es5' | 'es6', extraCompilerOptions: ts.CompilerOptions = {}) {
    return (done: DoneCallback) => {
        const cliOptions = new NgcCliOptions({});

        const tsOptions: ts.CompilerOptions = Object.assign({}, extraCompilerOptions, {
            target: target === 'es6' ? ts.ScriptTarget.ES2016 : ts.ScriptTarget.ES5
        });

        ngc(sourceDirectory, cliOptions, codegen, tsOptions)
            .then(done)
            .catch((error) => {
                console.error(error.stack);
                console.error('Compilation failed');
                process.exit(1);
            });
    };
}

gulp.task('ngc.dist.es5', ngcTask(projectConfig.distPath, 'es5'));

gulp.task('ngc.dist.es6', ngcTask(projectConfig.distPath, 'es6'));

function rollupTask(moduleFormat: 'es' | 'umd', filenameInfix?: string, intro?: string) {

    const { scope, moduleName } = splitNpmPackageName(projectConfig.moduleName);

    return (done: DoneCallback) => {
        const rollupOptions = {
            entry: `${projectConfig.distPath}/index.js`,
            external: globalsResolverToExternalResolver(projectConfig.rollupGlobals)
        };
        const bundleOptions = {
            format: moduleFormat,
            dest: `${projectConfig.distPath}/bundles/${moduleName}${filenameInfix || ''}.js`,
            moduleName: (scope ? toLowerCamelCase(scope) + '.' : '') + toLowerCamelCase(moduleName),
            globals: projectConfig.rollupGlobals,
            intro
        };
        rollup(rollupOptions)
            .then((bundle) => bundle.write(bundleOptions))
            .then(() => done())
            .catch((error) => {
                console.error(error);
                process.exit(1);
            });
    };
}

gulp.task('rollup.dist.es5.umd', rollupTask('umd', '.umd', typescriptHelperFunctions.umd.trim()));

gulp.task('rollup.dist.es5.esm', rollupTask('es', '.es5', typescriptHelperFunctions.esm.trim()));

gulp.task('rollup.dist.es6', rollupTask('es'));

gulp.task('patch-metadata.dist', (done: DoneCallback) => {
    gulp.src(`${projectConfig.distPath}/**/*.metadata.json`)
        .pipe(jsonTransform((metadataObject) => {
            function addImportAsToMetdata(data: any) {
                data.importAs = projectConfig.moduleName;
            }

            if (Array.isArray(metadataObject)) {
                metadataObject.forEach(addImportAsToMetdata);
            } else {
                addImportAsToMetdata(metadataObject);
            }

            return metadataObject;
        }))
        .pipe(gulp.dest(projectConfig.distPath))
        .on('end', () => done());
});

gulp.task('clean.dist.post', (done: DoneCallback) => {
    const removalPatterns = [
        'src/**/*.js',
        'src/**/!(*.d).ts',
        'src/**/*.map',
        'index.{js,ts,js.map}',
        'tsconfig.json'
    ];

    removalPatterns
        .map((pattern) => `${projectConfig.distPath}/${pattern}`)
        .reduceRight((executeNext, pattern) =>
            (error?: string) => error ? executeNext(error) : rimraf(pattern, executeNext), done)();
});

gulp.task('copy.static.dist', (done: DoneCallback) => {
    const patterns = projectConfig.staticFiles.map((staticFile) => staticFile(projectConfig.basePath));
    gulp.src(patterns)
        .pipe(gulp.dest(projectConfig.distPath))
        .on('end', () => done());
});

gulp.task('test', (done: DoneCallback) => runSequence(
    'tslint.src',
    'clean.test.pre',
    ['copy.tsconfig.test', 'copy.ts.test'],
    'ngc.test',
    'create.systemjs-config.test',
    'run.karma',
    done
));

gulp.task('clean.test.pre', (done: DoneCallback) => {
    rimraf(projectConfig.testBuildPath, done);
});

gulp.task('copy.ts.test', copySourceTask(`${projectConfig.srcPath}/**/*.ts`, projectConfig.testBuildPath));

gulp.task('copy.tsconfig.test', (done: DoneCallback) => {
    gulp.src(`${projectConfig.srcPath}/tsconfig.json`)
        .pipe(gulp.dest(projectConfig.testBuildPath))
        .on('end', () => done());
});

gulp.task('ngc.test', ngcTask(projectConfig.testBuildPath, 'es5', {
    module: ts.ModuleKind.CommonJS,
    noEmitHelpers: false,
    declaration: false,
    sourceMap: false,
    inlineSourceMap: true
}));

gulp.task('create.systemjs-config.test', (done: DoneCallback) => {
    const systemjsModuleConfig = mergeSystemjsModuleConfig(projectConfig.systemjsModuleConfig, {
        paths: {
            '*': 'node_modules/*'
        },
        packages: {
            '': {
                defaultExtension: 'js'
            }
        }
    });

    const systemjsConfig = {
        baseURL: '/base/',
        map: systemjsModuleConfig.map,
        paths: systemjsModuleConfig.paths,
        packages: systemjsModuleConfig.packages
    };

    const path = `${projectConfig.testBuildPath}/${projectConfig.systemjsConfigFile}`;
    const data = `System.config(${JSON.stringify(systemjsConfig)});`;
    writeFile(path, data, done);
});

gulp.task('run.karma', (done: DoneCallback) => {
    const karmaOptions: ExtendedKarmaConfig = {
        frameworks: ['jasmine'],
        browsers: ciInfo.TRAVIS ? ['ChromeTravisCi'] : ['Chrome'],
        customLaunchers: {
            ChromeTravisCi: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        },
        singleRun: true,
        autoWatch: false,
        logLevel: karmaConstants.LOG_INFO,
        reporters: [ 'mocha', 'coverage' ],
        coverageReporter: {
            type: 'text-summary'
        },
        colors: true,
        port: 9876,
        basePath: './',
        files: [
            ...projectConfig.karmaFiles,
            `${projectConfig.testBuildPath}/${projectConfig.systemjsConfigFile}`,
            { pattern: `${projectConfig.testBuildPath}/**/*.js`, included: false, watched: false },
            { pattern: `${projectConfig.testBuildPath}/**/*.ts`, included: false, watched: false },
            'build-tools/static/karma-boot.js'
        ],
        preprocessors: {
           [`${projectConfig.testBuildPath}/**/*.js`]: ['sourcemap'],
           [`${projectConfig.testBuildPath}/!(spec-utils)/**/!(*.spec).js`]: ['coverage'],
           [`${projectConfig.testBuildPath}/!(*.spec).js`]: ['coverage']
        }
    };

    runKarma(karmaOptions, done);
});

type DoneCallback = (error?: any) => void;

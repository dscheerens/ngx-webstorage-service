// tslint:disable:no-implicit-dependencies
import { ParsedConfiguration, readConfiguration } from '@angular/compiler-cli';

import { ngPackagr  } from 'ng-packagr';

import { pick } from 'lodash';

const ngPackagrDefaultTsConfig = readConfiguration('./node_modules/ng-packagr/lib/ts/conf/tsconfig.ngc.json');
const projectTsConfig = readConfiguration('./tsconfig.json');
const tsConfig = applyTsConfigOverrides(ngPackagrDefaultTsConfig, projectTsConfig);

ngPackagr()
    .forProject('./package.json')
    .withTsConfig(tsConfig)
    .build()
    .catch(() => process.exit(1)); // Make sure the process exits with a non-zero exit code when the build fails.

function applyTsConfigOverrides(baseConfiguration: ParsedConfiguration, projectConfiguration: ParsedConfiguration): ParsedConfiguration {

    const projectOptions = pick(
        projectConfiguration.options,
        'noErrorTruncation',
        'noFallthroughCasesInSwitch',
        'noImplicitAny',
        'noImplicitReturns',
        'noImplicitThis',
        'noStrictGenericChecks',
        'noUnusedLocals',
        'noUnusedParameters',
        'strictNullChecks',
        'strictPropertyInitialization',
        'lib'
    );

    return {
        ...baseConfiguration,
        options: {
            ...baseConfiguration.options,
            ...projectOptions
        }
    };

}

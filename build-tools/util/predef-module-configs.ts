import { ModuleConfig } from './project-config.model';

// Module configuration for Lodash.
const lodash: ModuleConfig = {
    moduleName: 'lodash',
    systemjs: {
        map: {
            lodash: 'node_modules/lodash'
        },
        packages: {
            lodash: { main: 'lodash.js', defaultExtension: 'js' }
        }
    },
    karmaFiles: [
        { pattern: 'node_modules/lodash/**/*.js', included: false }
    ],
    rollupGlobals: {
        lodash: '_'
    }
};

export const PREDEF_MODULE_CONIGS = {
    lodash
};

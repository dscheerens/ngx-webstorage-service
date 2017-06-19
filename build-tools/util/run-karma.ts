import * as karma from 'karma';

import { ExtendedKarmaConfig } from './karma-config.model';

export function runKarma(karmaOptions: ExtendedKarmaConfig, done: (error?: Error) => void) {

    const karmaServer = new karma.Server(karmaOptions, (exitCode) => {
        if (exitCode === 0) {
            done();
        } else {
            done(new Error(`Karma exited with code ${exitCode}`));
        }
    });

    karmaServer.start();
}

import * as karma from 'karma';

export const karmaConstants = karma.constants;

export type KarmaConfig = karma.ConfigOptions;

export interface ExtendedKarmaConfig extends karma.ConfigOptions {
    customLaunchers?: { [key: string]: any };
    coverageReporter?: any;
}

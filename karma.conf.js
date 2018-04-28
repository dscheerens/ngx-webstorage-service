const ciInfo = require('ci-info');
const os = require('os');

const chromeHeadlessSupported = os.platform() !== 'win32' || Number((os.release().match(/^(\d+)/) || ['0', '0'])[1]) >= 10;

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', '@angular/cli'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-coverage-istanbul-reporter'),
            require('karma-coverage'),
            require('karma-mocha-reporter'),
            require('@angular/cli/plugins/karma')
        ],
        client: {
            clearContext: false
        },
        coverageIstanbulReporter: {
            reports: ['html', 'lcovonly'],
            fixWebpackSourcePaths: true
        },
        angularCli: {
            environment: 'dev',
            app: 'lib',
            sourceMap: true
        },
        reporters: ['mocha', 'coverage'],
        coverageReporter: {
            type: 'text-summary'
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browserNoActivityTimeout: 30000,
        browsers: [
            ciInfo.TRAVIS           ? 'ChromeTravisCi' :
            chromeHeadlessSupported ? 'ChromeHeadless' :
                                      'Chrome'
        ],
        customLaunchers: {
            ChromeHeadless: {
                base: 'Chrome',
                flags: [ '--headless', '--disable-gpu', '--remote-debugging-port=9222' ]
            },
            ChromeTravisCi: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        },
        singleRun: false
    });
};

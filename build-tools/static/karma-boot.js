(function() {
    const karma = window.__karma__;

    const specFilePattern = RegExp('\.spec\.js$', 'i');

    const specFiles = Object.keys(karma.files)
        .filter(function(file) { return specFilePattern.test(file); });

    karma.loaded = function() { };

    Promise.all([
        System.import('@angular/core/testing'),
        System.import('@angular/platform-browser-dynamic/testing')
    ]).then(function(modules) {
        var coreTesting = modules[0];
        var platformBrowserDynamicTesting = modules[1];

        coreTesting.TestBed.initTestEnvironment(
            platformBrowserDynamicTesting.BrowserDynamicTestingModule,
            platformBrowserDynamicTesting.platformBrowserDynamicTesting()
        );
    }).then(function() {
        return Promise.all(specFiles
            .map(getModuleName)
            .map(function(specModuleName) {
                return System.import(specModuleName);
            })
        );
    }).then(
        function () {
            karma.start();
        },
        function (error) {
            var message = [];
            if (error.message) {
                message.push(error.message);
            }
            if (error.stack) {
                message.push(error.stack);
            }
            if (!message.length) {
                message.push(error);
            }
            console.error(message.join('\n'));
            karma.start();
        }
    );

    function getModuleName(filePath) {
        return filePath.replace(/\\/g, '/')
            .replace(/^\/base\//, '')
            .replace(/\.js$/, '');
    }

})();

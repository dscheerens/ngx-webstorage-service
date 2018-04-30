# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="3.0.0"></a>
# [3.0.0](https://github.com/dscheerens/ngx-webstorage-service/compare/v2.0.0...v3.0.0) (2018-04-30)


### Chores
* replace build tooling with 'ng-packgr' and 'angular-cli' ([7afd530](https://github.com/dscheerens/ngx-webstorage-service/commit/7afd530))
* integrate `standard-version` ([6a0142a](https://github.com/dscheerens/ngx-webstorage-service/commit/6a0142a))


### Features

* support for clearing storage ([68927a8](https://github.com/dscheerens/ngx-webstorage-service/commit/68927a8))
* support storage transcoders ([3b58ef6](https://github.com/dscheerens/ngx-webstorage-service/commit/3b58ef6)), closes [#1](https://github.com/dscheerens/ngx-webstorage-service/issues/1)


### BREAKING CHANGES

* `StorageService.get(key)` will now return `undefined` instead of `null` when no entry exists for the specified key.
* Because of the introduction of storage transcoding, the `StorageService` interface now expects a type parameter `T`, which represents the type of values that can be stored and retrieved.
  By default the storage services use the JSON transcoder, which supports any type of value (as long as it can be JSON encoded).
  Therefore the type parameter `T` of `StorageService` defaults to `any`, so the introduction of this parameter should not break existing code.
* Because of the switch to 'ng-packagr' the FESM2015, FESM5 and UMD bundles now reside in different folders.
  You might need to update your build tools accordingly:
  * `bundles/ngx-webstorage-service.js` -> `esm2015/ngx-webstorage-service.js`
  * `bundles/ngx-webstorage-service.es5.js` -> `esm5/ngx-webstorage-service.js`
  * `bundles/ngx-webstorage-service.umd.js` -> *(location is unchanged)*
* Furthermore the minimum Angular version has been updated to >=5.0.0.

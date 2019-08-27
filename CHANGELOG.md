# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

# [4.1.0](https://github.com/dscheerens/ngx-webstorage-service/compare/v4.0.1...v4.1.0) (2019-08-27)


### Features

* **transcoders:** add transcoders for dates ([9ac3e0c](https://github.com/dscheerens/ngx-webstorage-service/commit/9ac3e0c))



## [4.0.1](https://github.com/dscheerens/ngx-webstorage-service/compare/v4.0.0...v4.0.1) (2019-02-27)


### Bug Fixes

* use `localStorageFactory` instead `sessionStorageFactory` of for `LOCAL_STORAGE` token (closes [#9](https://github.com/dscheerens/ngx-webstorage-service/issues/9)) ([4195180](https://github.com/dscheerens/ngx-webstorage-service/commit/4195180))



# [4.0.0](https://github.com/dscheerens/ngx-webstorage-service/compare/v3.1.3...v4.0.0) (2019-02-21)


### Features

* make `SESSION_STORAGE` and `LOCAL_STORAGE` self providing in the root injector ([8786c26](https://github.com/dscheerens/ngx-webstorage-service/commit/8786c26))
* upgrade to Angular 7 ([71cd574](https://github.com/dscheerens/ngx-webstorage-service/commit/71cd574))


### BREAKING CHANGES

* Storage services injected using the `SESSION_STORAGE` and `LOCAL_STORAGE` injection tokens are no longer part of the `StorageServiceModule` (now deprecated). Instead they are now self providing in the root injector, which makes them true singleton services. Before multiple instances of these services could exist when lazy loaded routes were used. In practice, however, this change probably doesn't require any modifications to your codebase.
* the peer dependency for `@angular/core` has been updated to `>=7.0.0`



<a name="3.1.3"></a>
## [3.1.3](https://github.com/dscheerens/ngx-webstorage-service/compare/v3.1.2...v3.1.3) (2018-12-10)


### Bug Fixes

* incorrect condition when checking the webstorage availability ([e975d08](https://github.com/dscheerens/ngx-webstorage-service/commit/e975d08))



<a name="3.1.2"></a>
## [3.1.2](https://github.com/dscheerens/ngx-webstorage-service/compare/v3.1.1...v3.1.2) (2018-12-10)


### Bug Fixes

* webstorage availability check failing due to `localStorage` and `sessionStorage` being defined but not accessible in certain scenarios (closes [#8](https://github.com/dscheerens/ngx-webstorage-service/issues/8)) ([3637d33](https://github.com/dscheerens/ngx-webstorage-service/commit/3637d33))



<a name="3.1.1"></a>
## [3.1.1](https://github.com/dscheerens/ngx-webstorage-service/compare/v3.1.0...v3.1.1) (2018-06-20)


### Bug Fixes

* reference error when module is used in a non-browser environment (closes [#5](https://github.com/dscheerens/ngx-webstorage-service/issues/5)) ([64ef276](https://github.com/dscheerens/ngx-webstorage-service/commit/64ef276))



<a name="3.1.0"></a>
# [3.1.0](https://github.com/dscheerens/ngx-webstorage-service/compare/v3.0.0...v3.1.0) (2018-05-01)


### Features

* allow for checking the presence of an entry in storage (`storageService.has(key)`) ([679f0e8](https://github.com/dscheerens/ngx-webstorage-service/commit/679f0e8))



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



<a name="2.0.0"></a>
# [2.0.0](https://github.com/dscheerens/ngx-webstorage-service/compare/v1.0.2...v2.0.0) (2017-12-03)


### Chores
* rename package from `angular-webstorage-service` to `ngx-webstorage-service` ([2f72618](https://github.com/dscheerens/ngx-webstorage-service/commit/2f72618))


### BREAKING CHANGES
* Replace your import statements from `'angular-webstorage-service'` to `'ngx-webstorage-service'`.
* Due to the rename of the package the name of bundle files have also been updated:
  * `bundles/angular-webstorage-service.js` -> `bundles/ngx-webstorage-service.js`
  * `bundles/angular-webstorage-service.es5.js` -> `bundles/ngx-webstorage-service.es5.js`
  * `bundles/angular-webstorage-service.umd.js` -> `bundles/ngx-webstorage-service.umd.js`



<a name="1.0.2"></a>
## [1.0.2](https://github.com/dscheerens/ngx-webstorage-service/compare/v1.0.1...v1.0.2) (2017-12-03)


### Chores
* fixed some typos in `README.md` ([9716ed6](https://github.com/dscheerens/ngx-webstorage-service/commit/9716ed6))
* upgrade build tooling ([8a1e497](https://github.com/dscheerens/ngx-webstorage-service/commit/8a1e497))
* Added notice about (upcoming) package rename ([a9311b7](https://github.com/dscheerens/ngx-webstorage-service/commit/a9311b7))



<a name="1.0.1"></a>
## [1.0.1](https://github.com/dscheerens/ngx-webstorage-service/compare/v1.0.0...v1.0.1) (2017-06-20)


### Bug Fixes
* incorrect session storage provider ([0b84e20](https://github.com/dscheerens/ngx-webstorage-service/commit/0b84e20))



<a name="1.0.0"></a>
# 1.0.0 (2017-06-19)

### Initial release

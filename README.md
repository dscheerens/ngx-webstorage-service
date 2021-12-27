[![Build Status](https://github.com/dscheerens/ngx-webstorage-service/actions/workflows/main.yml/badge.svg?branch=master)](https://github.com/dscheerens/ngx-webstorage-service/actions/workflows/main.yml) [![NPM Version](https://img.shields.io/npm/v/ngx-webstorage-service.svg)](https://www.npmjs.com/package/ngx-webstorage-service)

# Webstorage services for Angular

This package provides service wrappers for the [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API).
Whenever your application needs to use `localStorage` or `sessionStorage`, instead of using them directly you can make use of the wrapped versions provided by this package.
Doing so has the following advantages:

* Switching from one type of storage to another is really easy.
* It provides a simple uniform interface that allows you to add other kinds of backing storage. For example you could easily create a cookie based storage implementation.
* This package comes with a built-in volatile in-memory backing storage, which can be used as a drop in replacement, e.g. for unit tests.
* Mocking storage in unit tests becomes a piece of cake.
* The `localStorage` and `sessionStorage` wrappers have built-in availability checks, that fall back to in-memory storage when they are unavailable.
  The latter can happen for example for older browsers or for browsers that disable web storage when private browsing mode is enabled.
* By default the storage services can be used to store any value that can be serialized as a JSON string.
  This means you do not have to serialize and deserialize non-string values yourself, which makes the use of the storage services a bit more ergonomic compared to the direct use of `localStorage` and `sessionStorage`.
  However, instead of JSON you can also choose to use other [storage transcoders](#storage-transcoders), which allows you to control what type of values can be stored and retrieved and also in what format data is stored.

## Installation

Simply add the `ngx-webstorage-service` module to your `package.json` file by executing the following command:

```
npm install --save ngx-webstorage-service
```

After having installed the `ngx-webstorage-service` package you might need to update your project configuration depending on the build tools you use (e.g. when using SystemJS).

The `ngx-webstorage-service` package is published in the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview).

### Angular version compatibility matrix

Use the compatibility matrix below to determine which version of this module works with your project's Angular version.

| Library version                          | Angular version |
| ---------------------------------------- | --------------- |
| `angular-webstorage-service` - **1.x.x** | >=  **4.0.0**   |
| `ngx-webstorage-service` - **2.x.x**     | >=  **4.0.0**   |
| `ngx-webstorage-service` - **3.x.x**     | >=  **5.0.0**   |
| `ngx-webstorage-service` - **4.x.x**     | >=  **7.0.0**   |
| `ngx-webstorage-service` - **5.x.x**     | >= **13.0.0**   |

## Usage

To make use of the (web) storage services in your application inject the storage services into your own classes.
For example to make use of session storage import the `SESSION_STORAGE` injection token, together with the `StorageService` interface, and use those to inject the session storage service.
The code snippet below shows an example.

```TypeScript
import { Inject, Injectable } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';

const STORAGE_KEY = 'pure-awesomeness';

@Injectable()
export class MyAwesomeService {

    constructor(@Inject(SESSION_STORAGE) private storage: StorageService) {

    }

    public doSomethingAwesome(): number {
        const awesomenessLevel: number = this.storage.get(STORAGE_KEY) || 1337;
        this.storage.set(STORAGE_KEY, awesomenessLevel + 1);
        return awesomenessLevel;
    }
}
```

One thing you have to keep in mind while designing your own application or library that makes use of this package, is to think about reusability and maintainability of the classes that are going to depend on the `StorageService` interface.
Instead of directly using the `SESSION_STORAGE` or `LOCAL_STORAGE` injection tokens it might be wise to introduce your own injection token.
For the code example above you could do it like this:

```TypeScript
export const MY_AWESOME_SERVICE_STORAGE =
    new InjectionToken<StorageService>('MY_AWESOME_SERVICE_STORAGE');

@Injectable()
export class MyAwesomeService {

    constructor(
        @Inject(MY_AWESOME_SERVICE_STORAGE) private storage: StorageService
    ) {

    }

    // ...
}
```

Then, in your module definition, you can create a provider for the injection token like so:

```TypeScript
import { NgModule } from '@angular/core';
import { SESSION_STORAGE } from 'ngx-webstorage-service';

import { MY_AWESOME_SERVICE_STORAGE, MyAwesomeService } from './my-awesome-service';

@NgModule({
    providers: [
        { provide: MY_AWESOME_SERVICE_STORAGE, useExisting: SESSION_STORAGE },
        MyAwesomeService
    ]
})
export class AwesomeModule {

}
```

By introducing your own injection token you'll give users of your API more control over what type of storage to use.
This makes it easier for the user to select the appropriate type of storage.
In general it should not matter anyway which type of storage is used from the perspective of the API you are developing (it only needs to store data).
The specific application of the API governs which type of storage is appropriate.

## API

The heart of this package is the `StorageService<T>` interface.
This `interface` has the following functions:

* `has(key: string): boolean` -
  Checks whether an entry with the specified key exists in the storage.
* `get(key: string): T | undefined` -
  Retrieves the value stored for the entry that is associated with the specified key.
  If no such entry exists or if the service for some reason is unable to fetch the value of the entry then `undefined` will be returned.
* `get<X>(key: string, decoder: StorageDecoder<X>): X | undefined` -
  Same as `get(key)` but instead uses the specified decoder to retrieve a value of type `X` instead of `T`.
  *For more information see the [Storage transcoders](#storage-transcoders) section.*
* `set(key: string, value: T): void` -
  Creates or updates the entry identified by the specified key with the given value.
  Storing a value into the storage service will ensure that an equivalent of the value can be read back, i.e. the data and structure of the value will be the same.
  It, however, does not necessarily return the same value, i.e. the same reference.
* `set<X>(key: string, value: X, encoder: StorageEncoder<X>): void` -
  Same as `set(key, value)` but instead uses the specified encoder.
  *For more information see the [Storage transcoders](#storage-transcoders) section.*
* `remove(key: string): void` -
  Removes the entry that is identified by the specified key. Attempting to remove an entry for an unknown key will have no effect.
  Attempting to retrieve an entry via the `get` method after it has been removed will result in `undefined`.
* `clear(): void` -
  Clears the storage by removing all entries from the storage.
  Subsequent `get(x)` calls for a key *x* will return `undefined`, until a new value is set for key *x*.
* `withDefaultTranscoder<X>(transcoder: StorageTranscoder<X>): StorageService<X>` -
  Creates a new storage service that uses the specified transcoder by default for read and write operations.
  The new storage service uses the storage service on which this function is invoked as underlying storage.
  Both storage services will thus be able to access the same data.
  **Note that the default transcoder will not be changed for the storage service on which this function is invoked.**
  *For more information see the [Storage transcoders](#storage-transcoders) section.*

Two implementations of the `StorageService` are provided by this package:

* `InMemoryStorageService` -
  A volatile `StorageService` implementation.
  This service guarantees that data stored will remain available as long as the application instance is active.
  After the application is terminated all data that is stored within the service will be lost.
* `WebStorageService` -
  This class serves as a wrapper for the `localStorage` and `sessionStorage` [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) objects.
  You should not create an instance of this class yourself.
  Instead make use of the `LOCAL_STORAGE` and `SESSION_STORAGE` injection tokens.
  By using these tokens instead it becomes easier to override them with another implementation, e.g. a mock version when running unit tests.
  Also these injection tokens have a fallback mechanism available that switches to the `InMemoryStorageService` when `localStorage` and `sessionStorage` are not available.

In case you want to check whether `localStorage` and `sessionStorage` are available within the current browser yourself, you can make use of the `isStorageAvailable` function.
This function accepts one parameter of type [`Storage`](https://developer.mozilla.org/en-US/docs/Web/API/Storage) (which is part of the HTML 5 specification) and returns a boolean that indicates whether the storage is available.
An example use of the function is shown below:

```TypeScript
import { isStorageAvailable } from 'ngx-webstorage-service';

const sessionStorageAvailable = isStorageAvailable(sessionStorage);

console.log(`Session storage available: ${sessionStorageAvailable}`);
```

## Storage transcoders

With the release of version 3.0.0 of `ngx-webstorage-service` the concept of storage transcoding has been introduced.
A storage transcoder determines what type of values can be stored and retrieved by a `StorageService` instance.
This is reflected by the type parameter `T` in the `StorageService` interface.
By default any type of value can be stored as long as it can be represented by a JSON string.
Hence the type parameter `T` defaults to `any`.

Sometimes, however, you might prefer to store the data in another format than JSON strings, for example if values are read/written by a third party library that uses a different format.
This is often the case when the stored value is just a string.
Since values are read/written as JSON strings a normal string will be wrapped in quotes by default (as this is how strings are encoded in JSON format).
If the third party library writes string values without quotes, then `ngx-webstorage-service` will not be able to read the value, because it is not a valid JSON string.

This problem can be addressed by using a different transcoder, which is illustrated in the following example:

```Typescript
import { Inject, Injectable } from '@angular/core';
import { SESSION_STORAGE, StorageService, StorageTranscoders } from 'ngx-webstorage-service';

@Injectable()
export class MyAwesomeService {

    constructor(@Inject(SESSION_STORAGE) storage: StorageService) {
        // Mimic third party storing a value...
        sessionStorage.setItem('foo', 'bar');

        // Retrieve value...
        storage.get('foo'); // undefined :(
        storage.get('foo', StorageTranscoders.STRING); // 'bar' :)
    }
}
```

Both the `get` and `set` functions of the `StorageService` have been overloaded to accept an optional `StorageTranscoder`.
If you only use one type of transcoder for the storage service (other than JSON), then you can also make use of the `withDefaultTranscoder` function of the `StorageService` interface to create a new instance that uses the specified transcoder by default.
An example of this is shown below:

```Typescript
import { Inject, Injectable } from '@angular/core';
import { SESSION_STORAGE, StorageService, StorageTranscoders } from 'ngx-webstorage-service';

@Injectable()
export class AnsweringService {

    private numberStorage: StorageService<number>

    constructor(@Inject(SESSION_STORAGE) storage: StorageService) {
        this.numberStorage = storage.withDefaultTranscoder(StorageTranscoders.NUMBER);
    }

    public get theAnswer(): number {
        return numberStorage.get('answer');
    }

    public set theAnswer(value: number) {
        return numberStorage.set('answer', value);
    }
}
```

The following storage transcoders are available:

* `StorageTranscoders.JSON` - Transcodes any value and stores it in JSON format.
* `StorageTranscoders.STRING` - Transcodes strings only and **does not change the format**.
* `StorageTranscoders.BOOLEAN` - Transcodes booleans and stores them as a strings with the value of either `'true'` or `'false'`.
* `StorageTranscoders.NUMBER` - Transcodes numbers and stores them as strings (_radix = 10_), e.g. `'123'` or `'-1.2e-34'`.
* `StorageTranscoders.DATE_ISO_STRING` - Transcodes Date objects and stores them as ISO strings, e.g. `'2019-08-26T15:18:05.822Z'`.
* `StorageTranscoders.DATE_EPOCH_TIME` - Transcodes Date objects and stores them as epoch timestamps, e.g. `'1566832685822'`.

It is also possible to create your own transcoder by defining an object that conforms to the `StorageTranscoder` interface.

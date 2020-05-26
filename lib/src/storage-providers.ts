import { InjectionToken } from '@angular/core';

import { InMemoryStorageService } from './in-memory-storage.service';
import { StorageService } from './storage.service';
import { WebStorageService, isLocalStorageAvailable, isSessionStorageAvailable } from './web-storage.service';

export function sessionStorageFactory(): StorageService {
    if (isSessionStorageAvailable()) {
        return new WebStorageService(sessionStorage);
    }

    return new InMemoryStorageService();
}

/** Injection token for the session storage service. */
export const SESSION_STORAGE = new InjectionToken<StorageService>(
    'SESSION_STORAGE',
    { providedIn: 'root', factory: sessionStorageFactory }
);

export function localStorageFactory(): StorageService {
    if (isLocalStorageAvailable()) {
        return new WebStorageService(localStorage);
    }

    return new InMemoryStorageService();
}

/** Injection token for the local storage service. */
export const LOCAL_STORAGE = new InjectionToken<StorageService>(
    'LOCAL_STORAGE',
    { providedIn: 'root', factory: localStorageFactory }
);

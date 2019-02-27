import { InjectionToken } from '@angular/core';

import { InMemoryStorageService } from './in-memory-storage.service';
import { StorageService } from './storage.service';
import { isStorageAvailable, WebStorageService } from './web-storage.service';

export function sessionStorageFactory(): StorageService {
    try {
        if (typeof sessionStorage as any !== 'undefined' && isStorageAvailable(sessionStorage)) {
            return new WebStorageService(sessionStorage);
        }
    } catch {}

    return new InMemoryStorageService();
}

/** Injection token for the session storage service. */
export const SESSION_STORAGE = new InjectionToken<StorageService>(
    'SESSION_STORAGE',
    { providedIn: 'root', factory: sessionStorageFactory }
);

export function localStorageFactory(): StorageService {
    try {
        if (typeof localStorage as any !== 'undefined' && isStorageAvailable(localStorage)) {
            return new WebStorageService(localStorage);
        }
    } catch {}

    return new InMemoryStorageService();
}

/** Injection token for the local storage service. */
export const LOCAL_STORAGE = new InjectionToken<StorageService>(
    'LOCAL_STORAGE',
    { providedIn: 'root', factory: localStorageFactory }
);

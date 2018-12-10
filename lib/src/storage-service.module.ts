import { InjectionToken, NgModule } from '@angular/core';

import { InMemoryStorageService } from './in-memory-storage.service';
import { StorageService } from './storage.service';
import { isStorageAvailable, WebStorageService } from './web-storage.service';

/** Injection token for the session storage service. */
export const SESSION_STORAGE = new InjectionToken<StorageService>('SESSION_STORAGE');

/** Injection token for the local storage service. */
export const LOCAL_STORAGE = new InjectionToken<StorageService>('LOCAL_STORAGE');

export function sessionStorageFactory(): StorageService {

    try {
        if (typeof sessionStorage as any !== 'undefined' && isStorageAvailable(sessionStorage)) {
            return new WebStorageService(sessionStorage);
        }
    } catch {}

    return new InMemoryStorageService();
}

export function localStorageFactory(): StorageService {
    try {
        if (typeof localStorage as any !== 'undefined' && isStorageAvailable(localStorage)) {
            return new WebStorageService(localStorage);
        }
    } catch {}

    return new InMemoryStorageService();
}

@NgModule({
    providers: [
        { provide: SESSION_STORAGE, useFactory: sessionStorageFactory },
        { provide: LOCAL_STORAGE, useFactory: localStorageFactory }
    ]
})
export class StorageServiceModule {

}

import { ProxyStorageService } from './proxy-storage.service';
import { InMemoryStorageService } from './in-memory-storage.service';
import { testStorageService } from './spec-utils/test-storage-service';
import { StorageTranscoders } from './storage-transcoders';

describe('proxy storage service', testStorageService(
    () => new ProxyStorageService(
        StorageTranscoders.JSON,
        new InMemoryStorageService()
    )
));

import { InMemoryStorageService } from './in-memory-storage.service';
import { testStorageService } from './spec-utils/test-storage-service';

describe('in memory storage service', testStorageService(() => new InMemoryStorageService()));

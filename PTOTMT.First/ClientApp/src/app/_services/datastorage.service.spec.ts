import { TestBed } from '@angular/core/testing';

import {DataStorageService } from './datastorage.service';

describe('DataStorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataStorageService = TestBed.get(DataStorageService);
    expect(service).toBeTruthy();
  });
});

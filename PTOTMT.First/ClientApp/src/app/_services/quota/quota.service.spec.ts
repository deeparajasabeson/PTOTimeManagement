import { TestBed } from '@angular/core/testing';

import { QuotaService } from './quota.service';

describe('QuotaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QuotaService = TestBed.get(QuotaService);
    expect(service).toBeTruthy();
  });
});

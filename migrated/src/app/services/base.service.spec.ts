import { TestBed } from '@angular/core/testing';

import { BaseService } from './base.service';

xdescribe('BaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BaseService = TestBed.get(BaseService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { SizeService } from './size.service';

xdescribe('SizeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SizeService = TestBed.get(SizeService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { PasswordService } from './password.service';

xdescribe('PasswordService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PasswordService = TestBed.get(PasswordService);
    expect(service).toBeTruthy();
  });
});

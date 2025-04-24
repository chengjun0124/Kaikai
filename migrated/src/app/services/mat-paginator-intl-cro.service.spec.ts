import { TestBed } from '@angular/core/testing';

import { MatPaginatorIntlCro } from './mat-paginator-intl-cro.service';

describe('MatPaginatorIntlCroService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MatPaginatorIntlCro = TestBed.get(MatPaginatorIntlCro);
    expect(service).toBeTruthy();
  });
});

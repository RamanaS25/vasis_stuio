import { TestBed } from '@angular/core/testing';

import { NotationsService } from './notations.service';

describe('NotationsService', () => {
  let service: NotationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

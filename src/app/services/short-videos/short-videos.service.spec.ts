import { TestBed } from '@angular/core/testing';

import { ShortVideosService } from './short-videos.service';

describe('ShortVideosService', () => {
  let service: ShortVideosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShortVideosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

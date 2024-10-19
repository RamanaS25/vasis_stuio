import { TestBed } from '@angular/core/testing';

import { MuxVideoService } from './mux-video.service';

describe('MuxVideoService', () => {
  let service: MuxVideoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MuxVideoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

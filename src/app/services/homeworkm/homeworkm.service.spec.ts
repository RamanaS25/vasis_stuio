import { TestBed } from '@angular/core/testing';

import { HomeworkmService } from './homeworkm.service';

describe('HomeworkmService', () => {
  let service: HomeworkmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeworkmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

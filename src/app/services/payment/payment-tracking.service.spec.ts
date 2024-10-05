import { TestBed } from '@angular/core/testing';

import { PaymentTrackingService } from './payment-tracking.service';

describe('PaymentTrackingService', () => {
  let service: PaymentTrackingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentTrackingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { LeaveApplicationServiceService } from './leave-application-service.service';

describe('LeaveApplicationServiceService', () => {
  let service: LeaveApplicationServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeaveApplicationServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

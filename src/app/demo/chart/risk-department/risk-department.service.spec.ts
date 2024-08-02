import { TestBed } from '@angular/core/testing';

import { RiskDepartmentService } from './risk-department.service';

describe('RiskDepartmentService', () => {
  let service: RiskDepartmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskDepartmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

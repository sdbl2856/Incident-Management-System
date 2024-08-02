import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskDepartmentComponent } from './risk-department.component';

describe('RiskDepartmentComponent', () => {
  let component: RiskDepartmentComponent;
  let fixture: ComponentFixture<RiskDepartmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RiskDepartmentComponent]
    });
    fixture = TestBed.createComponent(RiskDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

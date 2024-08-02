import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevertIncidentComponent } from './revert-incident.component';

describe('RevertIncidentComponent', () => {
  let component: RevertIncidentComponent;
  let fixture: ComponentFixture<RevertIncidentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RevertIncidentComponent]
    });
    fixture = TestBed.createComponent(RevertIncidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

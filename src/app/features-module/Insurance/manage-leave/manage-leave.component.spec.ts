import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageLeaveComponent } from './manage-leave.component';

describe('ManageLeaveComponent', () => {
  let component: ManageLeaveComponent;
  let fixture: ComponentFixture<ManageLeaveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageLeaveComponent]
    });
    fixture = TestBed.createComponent(ManageLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

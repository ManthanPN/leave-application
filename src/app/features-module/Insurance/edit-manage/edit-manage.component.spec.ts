import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditManageComponent } from './edit-manage.component';

describe('EditManageComponent', () => {
  let component: EditManageComponent;
  let fixture: ComponentFixture<EditManageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditManageComponent]
    });
    fixture = TestBed.createComponent(EditManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

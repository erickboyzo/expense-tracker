import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { ManageExpenseComponent } from './manage-expense.component';

describe('ManageExpenseComponent', () => {
  let component: ManageExpenseComponent;
  let fixture: ComponentFixture<ManageExpenseComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ManageExpenseComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

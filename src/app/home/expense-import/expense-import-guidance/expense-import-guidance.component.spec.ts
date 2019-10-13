import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseImportGuidanceComponent } from './expense-import-guidance.component';

describe('ExpenseImportGuidanceComponent', () => {
  let component: ExpenseImportGuidanceComponent;
  let fixture: ComponentFixture<ExpenseImportGuidanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseImportGuidanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseImportGuidanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

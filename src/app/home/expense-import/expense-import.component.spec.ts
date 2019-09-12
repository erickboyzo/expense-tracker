import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseImportComponent } from './expense-import.component';

describe('ExpenseImportComponent', () => {
  let component: ExpenseImportComponent;
  let fixture: ComponentFixture<ExpenseImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

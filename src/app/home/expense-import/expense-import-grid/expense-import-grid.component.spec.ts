import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseImportGridComponent } from './expense-import-grid.component';

describe('ExpenseImportGridComponent', () => {
  let component: ExpenseImportGridComponent;
  let fixture: ComponentFixture<ExpenseImportGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseImportGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseImportGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

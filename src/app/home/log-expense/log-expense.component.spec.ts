import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogExpenseComponent } from './log-expense.component';

describe('LogExpenseComponent', () => {
  let component: LogExpenseComponent;
  let fixture: ComponentFixture<LogExpenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogExpenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

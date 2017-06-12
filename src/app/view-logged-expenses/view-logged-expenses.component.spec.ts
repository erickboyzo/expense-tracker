import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLoggedExpensesComponent } from './view-logged-expenses.component';

describe('ViewLoggedExpensesComponent', () => {
  let component: ViewLoggedExpensesComponent;
  let fixture: ComponentFixture<ViewLoggedExpensesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewLoggedExpensesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewLoggedExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

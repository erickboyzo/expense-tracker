import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseFilterControlsComponent } from './expense-filter-controls.component';

describe('ExpenseFilterControlsComponent', () => {
  let component: ExpenseFilterControlsComponent;
  let fixture: ComponentFixture<ExpenseFilterControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseFilterControlsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseFilterControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseSettingsComponent } from './expense-settings.component';

describe('ExpenseSettingsComponent', () => {
  let component: ExpenseSettingsComponent;
  let fixture: ComponentFixture<ExpenseSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

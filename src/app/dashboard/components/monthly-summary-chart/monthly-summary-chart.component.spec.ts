import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { MonthlySummaryChartComponent } from './monthly-summary-chart.component';

describe('MonthlySummaryChartComponent', () => {
  let component: MonthlySummaryChartComponent;
  let fixture: ComponentFixture<MonthlySummaryChartComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MonthlySummaryChartComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlySummaryChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

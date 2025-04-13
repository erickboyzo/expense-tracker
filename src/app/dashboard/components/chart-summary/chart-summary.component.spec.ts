import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { ChartSummaryComponent } from './chart-summary.component';

describe('ChartSummaryComponent', () => {
  let component: ChartSummaryComponent;
  let fixture: ComponentFixture<ChartSummaryComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ChartSummaryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

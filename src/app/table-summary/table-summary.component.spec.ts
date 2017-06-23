import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableSummaryComponent } from './table-summary.component';

describe('TableSummaryComponent', () => {
  let component: TableSummaryComponent;
  let fixture: ComponentFixture<TableSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

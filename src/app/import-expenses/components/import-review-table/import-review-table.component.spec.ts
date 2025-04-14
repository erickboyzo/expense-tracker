import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportReviewTableComponent } from './import-review-table.component';

describe('ImportReviewTableComponent', () => {
  let component: ImportReviewTableComponent;
  let fixture: ComponentFixture<ImportReviewTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportReviewTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImportReviewTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

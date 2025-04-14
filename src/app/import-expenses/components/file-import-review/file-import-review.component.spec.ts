import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileImportReviewComponent } from './file-import-review.component';

describe('FileImportReviewComponent', () => {
  let component: FileImportReviewComponent;
  let fixture: ComponentFixture<FileImportReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileImportReviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FileImportReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

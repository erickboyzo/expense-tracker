import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileImportStepsComponent } from './file-import-steps.component';

describe('FileImportStepsComponent', () => {
  let component: FileImportStepsComponent;
  let fixture: ComponentFixture<FileImportStepsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileImportStepsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FileImportStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

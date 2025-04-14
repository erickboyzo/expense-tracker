import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileImportMapperComponent } from './file-import-mapper.component';

describe('FileImportMapperComponent', () => {
  let component: FileImportMapperComponent;
  let fixture: ComponentFixture<FileImportMapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileImportMapperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FileImportMapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

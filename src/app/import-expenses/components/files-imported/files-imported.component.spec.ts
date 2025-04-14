import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesImportedComponent } from './files-imported.component';

describe('FilesImportedComponent', () => {
  let component: FilesImportedComponent;
  let fixture: ComponentFixture<FilesImportedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilesImportedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FilesImportedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

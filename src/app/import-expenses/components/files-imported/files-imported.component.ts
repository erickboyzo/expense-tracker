import { Component, Input } from '@angular/core';
import { FileImportStepsComponent } from '../file-import-steps/file-import-steps.component';

@Component({
  selector: 'app-files-imported',
  imports: [FileImportStepsComponent],
  templateUrl: './files-imported.component.html',
  styleUrl: './files-imported.component.scss',
})
export class FilesImportedComponent {
  @Input() files!: File[];
}

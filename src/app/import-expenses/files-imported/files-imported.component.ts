import { Component, Input } from '@angular/core';
import { FileImportMapperComponent } from '../file-import-mapper/file-import-mapper.component';

@Component({
  selector: 'app-files-imported',
  imports: [FileImportMapperComponent],
  templateUrl: './files-imported.component.html',
  styleUrl: './files-imported.component.scss',
})
export class FilesImportedComponent {
  @Input() files!: File[];
}

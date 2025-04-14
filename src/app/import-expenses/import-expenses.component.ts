import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { FilesImportedComponent } from './components/files-imported/files-imported.component';
import { UploadFileComponent } from './components/upload-file/upload-file.component';

@Component({
  selector: 'app-import-expenses',
  imports: [MatCardModule, MatIcon, UploadFileComponent, CommonModule, FilesImportedComponent],
  templateUrl: './import-expenses.component.html',
  styleUrl: './import-expenses.component.scss',
})
export class ImportExpensesComponent {
  files: File[] = [];
}

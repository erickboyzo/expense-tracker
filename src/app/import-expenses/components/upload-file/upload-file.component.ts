import { Component, EventEmitter, inject, Output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResponsiveService } from '../../../shared/services/responsive.service';
import { DragAndDropDirective } from '../../directives/drag-and-drop.directive';

@Component({
  selector: 'app-upload-file',
  imports: [DragAndDropDirective, MatIcon, MatButton],
  templateUrl: './upload-file.component.html',
  styleUrl: './upload-file.component.scss',
})
export class UploadFileComponent {
  @Output() filesUploaded = new EventEmitter<File[]>();

  breakpointObserver = inject(ResponsiveService);
  isHandset = this.breakpointObserver.isHandset;

  private files: File[] = [];
  private snackBar: MatSnackBar = inject(MatSnackBar);

  onFileDropped(files: FileList) {
    const filesList = Array.from(files);
    if (!filesList.every((file) => file.type === 'text/csv')) {
      this.openSnackBar('Only .csv files can be upload' + 'ed. Please upload a CSV file.');
    } else {
      this.files = [...filesList];
      this.filesUploaded.emit(this.files);
      this.clearFiles();
    }
  }

  fileBrowseHandler(event: Event) {
    const input = event.target as HTMLInputElement;
    const fileList = input.files;
    this.prepareFilesList(fileList);
  }

  prepareFilesList(files: FileList | null) {
    if (files) {
      for (const item of files) {
        this.files.push(item);
      }
      this.filesUploaded.emit(this.files);
      this.clearFiles();
    } else {
      this.openSnackBar('No Files Uploaded.');
    }
  }

  private clearFiles() {
    this.files = [];
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }
}

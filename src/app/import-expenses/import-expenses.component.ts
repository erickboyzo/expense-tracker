import { CommonModule, NgIf } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStep, MatStepper } from '@angular/material/stepper';
import { transform } from 'lodash';
import { LoginService } from '../core/services/login.service';
import { ExpenseImportGridComponent } from '../home/expense-import/expense-import-grid/expense-import-grid.component';
import { ExpenseImportGuidanceComponent } from '../home/expense-import/expense-import-guidance/expense-import-guidance.component';
import { ExpenseImportComponent } from '../home/expense-import/expense-import.component';
import { ExpenseImportModel } from '../home/expense-import/expense-import.model';
import { FilesImportedComponent } from './files-imported/files-imported.component';
import { UploadFileComponent } from './upload-file/upload-file.component';

@Component({
  selector: 'app-import-expenses',
  imports: [
    MatCardModule,
    MatStepper,
    MatStep,
    ExpenseImportGuidanceComponent,
    ExpenseImportGridComponent,
    MatIcon,
    ExpenseImportComponent,
    MatButton,
    UploadFileComponent,
    CommonModule,
    FilesImportedComponent,
  ],
  templateUrl: './import-expenses.component.html',
  styleUrl: './import-expenses.component.scss',
})
export class ImportExpensesComponent {
  @ViewChild(MatStepper, { static: true }) stepper?: MatStepper;
  importedExpenses: ExpenseImportModel[] = [];
  step = 0;
  importComplete = false;
  sourceType = 'csv';
  sourceTypeOptions = ['csv', 'google'];
  files: File[] = [];

  private loginService: LoginService = inject(LoginService);
  private snackBar: MatSnackBar = inject(MatSnackBar);

  saveImportedExpenses() {
    // let categoriesAdded = false;
    // const currentUserKey = this.loginService.getUserId();
    // const categories =  this.loginService.getCurrentCategories();
    // this.importedExpenses
    //   .filter((e) => !e.error)
    //   .forEach((expense) => {
    //     const matchingCategory = find(
    //       this.loginService.getCurrentCategories(),
    //       (e: any) =>
    //         e.value === expense.category.trim() || e.value.toLowerCase() === expense.category.trim().toLowerCase(),
    //     );
    //     if (!matchingCategory) {
    //       categories.push({ value: expense.category, removable: true });
    //       categoriesAdded = true;
    //     } else {
    //       expense.category = matchingCategory.value;
    //     }
    //     if (typeof expense.date !== 'string') {
    //       expense.date = new Date(expense.date).toDateString();
    //     }
    //     this.database.saveNewExpense(
    //       pick(expense, ['date', 'name', 'amount', 'category', 'type', 'comments']),
    //       currentUserKey,
    //     );
    //   });
    // if (categoriesAdded) {
    //   this.saveCategories();
    // }
    // this.step = 3;
    // this.importComplete = true;
    // this.openSnackBar('Import Successful!');
    // this.moveToNextStep();
  }

  dataExported(data: ExpenseImportModel[]) {
    this.importedExpenses = data.map((e: ExpenseImportModel) => this.validateImportedData(e));
    this.step = 1;
    this.importComplete = false;
    this.moveToNextStep();
  }

  private moveToNextStep() {
    setTimeout(() => {
      this.stepper?.next();
    });
  }

  validateImportedData(e: ExpenseImportModel): ExpenseImportModel {
    const mappedExpense = transform(e as {}, (result: any, val: any, key: string) => {
      result[key.toLowerCase()] = val;
    }) as ExpenseImportModel;

    if (!mappedExpense.comments) {
      mappedExpense.comments = '';
    }

    if (!mappedExpense.type) {
      mappedExpense.type = 'Debit';
    }

    if (!mappedExpense.category) {
      mappedExpense.category = 'Unassigned';
    }

    mappedExpense.amount =
      (mappedExpense.amount as number) > 0 ? +mappedExpense.amount : this.handleMissingCsvData(mappedExpense);
    mappedExpense.date = new Date(mappedExpense.date)
      ? new Date(mappedExpense.date).toDateString()
      : this.handleMissingCsvData(mappedExpense);
    mappedExpense.description = mappedExpense.description || this.handleMissingCsvData(mappedExpense);
    mappedExpense.name = mappedExpense.description;
    return mappedExpense;
  }

  private handleMissingCsvData(expense: ExpenseImportModel): string {
    expense.error = true;
    return '?';
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

  // @ViewChild('fileDropRef', { static: false }) fileDropEl!: ElementRef;
  // files: any[] = [];

  /**
   * handle file from browsing
   */
  // fileBrowseHandler(files: any) {
  //   this.prepareFilesList(files);
  // }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  // deleteFile(index: number) {
  //   if (this.files[index].progress < 100) {
  //     console.log('Upload in progress.');
  //     return;
  //   }
  //   this.files.splice(index, 1);
  // }

  /**
   * Simulate the upload process
   */
  // uploadFilesSimulator(index: number) {
  //   setTimeout(() => {
  //     if (index === this.files.length) {
  //       return;
  //     } else {
  //       const progressInterval = setInterval(() => {
  //         if (this.files[index].progress === 100) {
  //           clearInterval(progressInterval);
  //           this.uploadFilesSimulator(index + 1);
  //         } else {
  //           this.files[index].progress += 5;
  //         }
  //       }, 200);
  //     }
  //   }, 1000);
  // }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: any[]) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
    // this.fileDropEl.nativeElement.value = '';
    // this.uploadFilesSimulator(0);
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}

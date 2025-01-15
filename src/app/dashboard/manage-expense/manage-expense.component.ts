import { CommonModule, DatePipe, NgIf } from '@angular/common';
import { Component, effect, inject, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatabaseService } from '../../core/services/database.service';
import { LoginService } from '../../core/services/login.service';
import { defaultExpenseTypes } from '../../shared/constants/expense-constants';
import { Expense } from '../../shared/interfaces/expense-model';
import { ExpenseDataService } from '../../shared/services/expense-data.service';

@Component({
  selector: 'app-manage-expense',
  templateUrl: './manage-expense.component.html',
  imports: [
    MatDialogModule,
    FormsModule,
    NgIf,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    DatePipe,
    MatButtonModule,
    MatInput,
    CommonModule,
  ],
  providers: [provideNativeDateAdapter()],
  styleUrls: ['./manage-expense.component.scss'],
})
export class ManageExpenseComponent implements OnInit {
  expense!: Expense;
  original!: Expense;
  update = false;
  categories: string[] = [];
  types: string[] = [];

  private dataService: ExpenseDataService = inject(ExpenseDataService);

  private expenseDataUpdate  = effect(()=> {
    this.categories = this.dataService.categoriesSignal();
    this.types = this.dataService.expenseSourcesSignal();
  })

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Expense,
    private dialogRef: MatDialogRef<ManageExpenseComponent>,
    private database: DatabaseService,
    private loginService: LoginService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.expense = { ...this.data, ...{ date: new Date(this.data.date) } };
    this.original = { ...this.data, ...{ date: new Date(this.data.date) } };
  }

  deleteExpense() {
    const userId = this.loginService.getUserId();
    this.database
      .deleteExpense(userId, this.expense.id as string)
      .then((_) => this.successfulDelete())
      .catch((err) => this.failedDeleted(err));
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 3000 });
  }

  successfulDelete() {
    this.dialogRef.close('Successful');
    this.openSnackBar('Expense Deleted!');
  }

  failedDeleted(err: Error) {
    this.openSnackBar(err.message);
  }

  pushUpdate() {
    const userId = this.loginService.getUserId();
    const key = this.expense.id;
    const expenseObj = { ...this.expense };
    delete expenseObj.id;
    this.database
      .updateExpense(userId, key as string, expenseObj)
      .then((_) => this.successfulUpdate())
      .catch((err) => this.failedUpdate(err));
  }

  successfulUpdate() {
    this.dialogRef.close('Successful');
    this.openSnackBar('Expense Updated!');
  }

  failedUpdate(err: Error) {
    this.openSnackBar(err.message);
  }

  updateExpense(valid: boolean | null) {
    if (valid) {
      this.pushUpdate();
    }
  }

  formatAmount() {
    if (this.expense.amount !== null) {
      if (typeof this.expense.amount !== 'string') {
        const rounded = this.expense.amount.toFixed(2);
        this.expense.amount = parseFloat(rounded);
      }
    }
  }

  reset() {
    this.expense = { ...this.original };
  }

  isExpenseUntouched(): boolean {
    return JSON.stringify(this.expense) === JSON.stringify(this.original);
  }
}

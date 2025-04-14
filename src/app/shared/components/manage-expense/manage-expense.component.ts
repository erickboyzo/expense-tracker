import { CommonModule, DatePipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isEqual } from 'lodash';
import { Expense } from '@core/interfaces/expense-model';
import { DatabaseService } from '@core/services/database.service';
import { ExpenseDataService } from '@core/services/expense-data.service';
import { UserService } from '@core/services/user.service';
import { ManageExpenseData } from '../../interfaces/manage-expense-data';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./manage-expense.component.scss'],
})
export class ManageExpenseComponent implements OnInit {
  expense!: Expense;
  original!: Expense;
  update = false;
  categories: string[] = [];
  types: string[] = [];

  private dataService: ExpenseDataService = inject(ExpenseDataService);

  private expenseDataUpdate = effect(() => {
    this.categories = this.dataService.categoriesSignal();
    this.types = this.dataService.expenseSourcesSignal();
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ManageExpenseData,
    private dialogRef: MatDialogRef<ManageExpenseComponent>,
    private database: DatabaseService,
    private userService: UserService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    const { expense } = this.data;
    this.expense = { ...expense, ...{ date: new Date(expense.date) } };
    this.original = { ...expense, ...{ date: new Date(expense.date) } };
    if (this.data.previewDataMode) {
      this.update = true;
      const { category, type } = expense;
      const categoryIncluded = this.dataService.categoriesSignal().includes(category);
      const typeIncluded = this.dataService.categoriesSignal().includes(category);
      if (!categoryIncluded) {
        this.categories.push(category);
      }
      if (!typeIncluded) {
        this.types.push(type);
      }
    }
  }

  deleteExpense() {
    const userId = this.userService.getUserId();
    this.database
      .deleteExpense(userId, this.expense.id as string)
      .then(() => this.successfulDelete())
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
    const userId = this.userService.getUserId();
    const key = this.expense.id;
    const expenseObj = { ...this.expense };
    delete expenseObj.id;
    this.database
      .updateExpense(userId, key as string, expenseObj)
      .then(() => this.successfulUpdate())
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
    const { previewDataMode } = this.data;
    if (previewDataMode) {
      this.dialogRef.close(this.expense);
      return;
    }
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
    return isEqual(this.expense, this.original);
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import { expense_types } from '../../shared/constants/expense-constants';
import { Expense } from '../../shared/interfaces/expense-model';
import { DatabaseService } from '../../services/database.service';
import { LoginService } from '../../services/login.service';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-manage-expense',
  templateUrl: './manage-expense.component.html',
  styleUrls: ['./manage-expense.component.scss']
})

export class ManageExpenseComponent implements OnInit {

  expense: Expense;
  original: Expense;
  update = false;
  categories: string[] = this.loginService.getCurrentCategories();
  types: string[] = expense_types;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Expense,
              private dialogRef: MatDialogRef<ManageExpenseComponent>,
              private database: DatabaseService,
              private loginService: LoginService,
              private snackBar: MatSnackBar) {

    this.expense = {...this.data, ...{date: new Date(this.data.date)}};
    this.original = {...this.data, ...{date: new Date(this.data.date)}};
  }

  ngOnInit() {
  }

  deleteExpense() {
    const userId = this.loginService.getUserId();
    this.database.deleteExpense(userId, this.expense.id)
      .then(_ => this.successfulDelete())
      .catch(err => this.failedDeleted(err));
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', {duration: 3000});
  }

  successfulDelete() {
    this.dialogRef.close('Successful');
    this.openSnackBar('Expense Deleted!');
  }

  failedDeleted(err: any) {
    this.openSnackBar(err.message)
  }

  pushUpdate() {
    const userId = this.loginService.getUserId();
    const key = this.expense.id;
    const expenseObj = {...this.expense};
    delete expenseObj.id;
    this.database.updateExpense(userId, key, expenseObj)
      .then(_ => this.successfulUpdate())
      .catch(err => this.failedUpdate(err));

  }

  successfulUpdate() {
    this.dialogRef.close('Successful');
    this.openSnackBar('Expense Updated!');
  }

  failedUpdate(err: any) {
    this.openSnackBar(err.message)
  }

  updateExpense(value: any, valid: any, form: any) {
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
    this.expense = {...this.original};
  }

  isExpenseUntouched(): boolean {
    return JSON.stringify(this.expense) === JSON.stringify(this.original);
  }

}

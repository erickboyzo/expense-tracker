import { Component, OnInit, Inject } from '@angular/core';
import { Expense } from '../models/expense-model';
import { MD_DIALOG_DATA, MdDialogRef, MdSnackBar } from '@angular/material';
import { DatabaseService } from '../providers/database.service';
import { LoginService } from '../providers/login.service';
import { expense_types } from '../models/user-model';

@Component({
  selector: 'app-manage-expense',
  templateUrl: './manage-expense.component.html',
  styleUrls: ['./manage-expense.component.less']
})

export class ManageExpenseComponent implements OnInit {

  expense = new Expense;
  original = new Expense;
  update: boolean = false;
  categories: string[] = this.loginService.getCurrentCategories();
  types: string[] = expense_types;

  constructor( @Inject(MD_DIALOG_DATA) public data: any,
    public dialogRef: MdDialogRef<ManageExpenseComponent>,
    private database: DatabaseService,
    private loginService: LoginService,
    private snackBar: MdSnackBar) {

    this.expense = { ...this.data };
    this.original = { ...this.data };
  }

  ngOnInit() {
  }

  deleteExpense() {
    let userId = this.loginService.getUserId();
    this.database.deleteExpense(userId, this.expense.id)
      .then(_ => this.successfulDelete())
      .catch(err => this.failedDeleted(err));
  }

  openSnackBar(message) {
    this.snackBar.open(message, '', { duration: 3000 });
  }

  successfulDelete() {
    this.dialogRef.close('Successful');
    this.openSnackBar('Expense Deleted!');
  }

  failedDeleted(err: any) {
    console.log(err, 'You do not have access!');
    this.openSnackBar(err.message)
  }

  pushUpdate() {
    let userId = this.loginService.getUserId();
    let key = this.expense.id;
    let expenseObj = { ...this.expense };
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
      let rounded = this.expense.amount.toFixed(2);
      this.expense.amount = parseFloat(rounded);
    }
  }

  reset() {
    this.expense = { ...this.original };
  }

  isExpenseUntouched() {
    return JSON.stringify(this.expense) === JSON.stringify(this.original);
  }

}

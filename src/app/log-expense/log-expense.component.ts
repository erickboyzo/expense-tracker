import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database/database';
import { LoginService } from '../providers/login.service';
import { DatabaseService } from '../providers/database.service';
import { Expense } from '../models/expense-model'
import { expense_types, expense_categories } from '../models/user-model';
import { MdSnackBar } from '@angular/material';
import { CurrencyPipe } from '@angular/common';


@Component({
  selector: 'app-log-expense',
  templateUrl: './log-expense.component.html',
  styleUrls: ['./log-expense.component.less']
})
export class LogExpenseComponent implements OnInit {

  categories: string[] = this.loginService.getCurrentCategories();
  types: string[] = expense_types;
  expenseObj: Expense = new Expense;
  isLoading = false;
  dateError = false;

  constructor(private loginService: LoginService,
    public snackBar: MdSnackBar,
    private database: DatabaseService) {
    database.categoriesAddedAnnounced$.subscribe(
      category => {
        this.updateExpenseCategories(category);
      });
  }

  ngOnInit() { }

  updateExpenseCategories(category: string) {
    console.log('new categories');
    this.categories = this.loginService.getCurrentCategories();
    console.log(this.categories);
  }

  saveExpenseEntry(expenseForm: any) {
    this.isLoading = true;
    this.expenseObj.date = this.expenseObj.date.toDateString();
    let currentUserKey = this.loginService.getUserId();
    this.database.saveNewExpense(this.expenseObj, currentUserKey).then((data) => {
      this.isLoading = false;
      expenseForm.resetForm();
      this.resetExpenseObj();
      this.showSnackBar();
      this.announceChange();
    }).catch(e => {
      this.isLoading = false;
      console.log('Failed');
    })
  }

  announceChange() {
    this.database.announceExpenseCreated('new expense');
  }

  resetExpenseObj() {
    this.expenseObj = new Expense;
  }

  showSnackBar() {
    this.snackBar.open('Expense saved!', '', { duration: 2000 });
  }

  save(value: any, valid: any, form: any) {
    if (valid) {
      this.saveExpenseEntry(form);
    }
  }

  checkDate(e: any) {
    this.dateError = (this.expenseObj.date == null);
  }

  clearForm(expenseForm: any) {
    this.dateError = false;
    expenseForm.resetForm();
    this.resetExpenseObj();
  }

  formatAmount() {
    if (this.expenseObj.amount !== null) {
      let rounded = this.expenseObj.amount.toFixed(2);
      this.expenseObj.amount = parseFloat(rounded);
    }
  }


}

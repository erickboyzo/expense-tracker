import {Component, OnInit} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database/database';
import {LoginService} from '../providers/login.service';
import {DatabaseService} from '../providers/database.service';
import {Expense} from '../models/expense-model'
import {expense_types, expense_categories} from "../models/user-model";
import {MdSnackBar} from "@angular/material";


@Component({
  selector: 'app-log-expense',
  templateUrl: './log-expense.component.html',
  styleUrls: ['./log-expense.component.less']
})
export class LogExpenseComponent implements OnInit {

  private selectedValue: string = '';
  private categories: string[] = expense_categories;
  private types: string[] = expense_types;
  private expenseObj: Expense = new Expense;
  isLoading = false;
  private userId: string;
  dateError = false;


  constructor(public db: AngularFireDatabase, private loginService: LoginService, public snackBar: MdSnackBar,
              private database: DatabaseService) {
  }

  ngOnInit() {

  }

  saveExpenseEntry(expenseForm: any) {
    this.isLoading = true;
    this.expenseObj.date = this.expenseObj.date.toDateString();
    let currentUserKey = this.loginService.getUserId()

    this.database.saveNewExpense(this.expenseObj, currentUserKey).then((data) => {
      console.log('Data Saved!');
      console.log(data);
      this.isLoading = false;
      expenseForm.resetForm();
      this.resetExpenseObj();
      this.showSnackBar();
    }).catch(e => {
      this.isLoading = false;
      console.log('Failed');
    })

  }

  resetExpenseObj() {
    this.expenseObj = new Expense;
  }

  showSnackBar() {
    this.snackBar.open('Expense saved!', '', {duration: 2000});
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


}

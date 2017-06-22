import {Component, OnInit} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database/database';
import {LoginService} from '../providers/login.service';
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


  constructor(public db: AngularFireDatabase, private loginService: LoginService, public snackBar: MdSnackBar) {
  }

  ngOnInit() {

  }

  saveExpenseEntry() {
    this.isLoading = true;

    let currentUserKey = this.loginService.getUserId();

    this.db.database.ref('users/' + currentUserKey + '/expenses').push(
      this.expenseObj
    ).then((snap) => {
      this.isLoading = false;
      console.log(snap);
      this.resetExpenseObj();
      this.showSnackBar();
    });

  }

  resetExpenseObj() {
    this.expenseObj = new Expense;
  }

  showSnackBar() {
    this.snackBar.open('Expense Created!', '', {duration: 2000});
  }


}

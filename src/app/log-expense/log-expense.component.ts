import {Component, OnInit} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database/database';
import {LoginService} from '../providers/login.service';
import {Expense} from '../models/expense-model'
import {expense_types, expense_categories} from "../models/user-model";


@Component({
  selector: 'app-log-expense',
  templateUrl: './log-expense.component.html',
  styleUrls: ['./log-expense.component.less']
})
export class LogExpenseComponent implements OnInit {

  private selectedValue: string = '';
  private categories: string[] = expense_categories;
  private types: string[] = expense_types;
  private expenseObj: Expense = {name: ' ', date: new Date(), category: ' ', type: '', amount: 34};
  isLoading = false;


  constructor(public db: AngularFireDatabase, private loginService: LoginService) {
  }

  ngOnInit() {

  }

  saveExpenseEntry() {
    this.isLoading=true;

    let currentUserKey = this.loginService.getUserId();

    this.db.database.ref('users/'+currentUserKey+'/expenses').push(
      this.expenseObj
    ).then((snap) => {
      this.isLoading=false;
      console.log(snap);
    });

  }
}

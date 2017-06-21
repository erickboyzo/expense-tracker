import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database/database';
import { LoginService } from '../providers/login.service';
import {Expense} from '../models/expense-model'




@Component({
  selector: 'app-log-expense',
  templateUrl: './log-expense.component.html',
  styleUrls: ['./log-expense.component.less']
})
export class LogExpenseComponent implements OnInit {

  private selectedValue: string = '';
  private categories: string[] = ['Travel', 'Food', 'Other'];
  private types: string[] = ['Cash', 'Credit', 'Debit'];
  private expenseObj: Expense = { name: ' ', date: new Date(), category: ' ', type: '', amount: 34 };


  constructor(public db: AngularFireDatabase, private loginService: LoginService) {
  }

  ngOnInit() {

  }

  pushData() {

  }
}

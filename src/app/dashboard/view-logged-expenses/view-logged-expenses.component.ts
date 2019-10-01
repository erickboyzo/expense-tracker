import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Expense } from '../../shared/models/expense-model';
import { DatabaseService } from '../../services/database.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-view-logged-expenses',
  templateUrl: './view-logged-expenses.component.html',
  styleUrls: ['./view-logged-expenses.component.scss']
})
export class ViewLoggedExpensesComponent implements OnInit, OnDestroy {
  expenseDataChart: any = [];
  expenseDataTable: Expense[] = [];
  metrics: {
    color?: string, value: string | number, metricTitle: string
  }[] = [];
  isLoadingExpenses = false;
  isDataReady = false;

  private expenses: Subscription;

  constructor(private database: DatabaseService,
              private loginService: LoginService) {
    this.loginService.userIdSetAnnounced$.subscribe(
      category => {
        this.getUserExpenses();
      });
  }

  ngOnInit() {
    this.getUserExpenses();
    setTimeout(() => this.scrollTop());
  }

  scrollTop() {
    const contentElement = document.getElementById('content');
    contentElement.scrollIntoView();
  }

  getUserExpenses() {
    const currentUser: string = this.loginService.getUser() ? this.loginService.getUser().email : null;
    if (currentUser) {
      this.database.getUserDetails(currentUser)
        .then(jsonData => {
          const obj = jsonData.toJSON();
          const key = Object.keys(obj)[0];
          this.loginService.setUserId(key);
          this.subToExpensesChange();
        }).catch(e => {
      });
    }
  }

  private subToExpensesChange() {
    const userId = this.loginService.getUserId();
    this.isLoadingExpenses = true;
    if (userId) {
      this.expenses = this.database.getUserExpenses(userId)
        .subscribe(snapshots => this.filterData(snapshots));
    } else {
      this.isLoadingExpenses = false;
    }
  }

  parseData(snapsShots: any) {
    const data = [];
    snapsShots.forEach(snapshot => {
      const expense = snapshot.payload.exportVal();
      expense.id = snapshot.key;
      data.push(expense);
    });
    return data;
  }

  filterData(snapshots) {
    console.log(snapshots);
    this.isLoadingExpenses = false;
    const parsedData = this.parseData(snapshots);


    const firstDate = new Date(Math.min.apply(null, parsedData.map((e) => new Date(e.date))));
    const lastDate = new Date(Math.max.apply(null, parsedData.map((e) => new Date(e.date))));
    const numOfEntries = parsedData.length;
    const totalAmount = this.getTotal(parsedData);


    this.metrics = [
      {color: null, value: firstDate.toDateString().slice(0, 15), metricTitle: 'Earliest expense logged date'},
      {color: null, value: lastDate.toDateString().slice(0, 15), metricTitle: 'Latest expense logged date'},
      {color: null, value: numOfEntries, metricTitle: 'Expenses logged'},
      {color: null, value: totalAmount, metricTitle: 'Total Amount'},
    ];

    const categories = parsedData
      .map(item => item.category)
      .filter((value, index, self) => self.indexOf(value) === index);

    const pieData = [];

    for (const category of categories) {
      let categorySum = 0;
      for (const value of parsedData) {
        if (value.category === category) {
          categorySum += value.amount;
        }
      }
      const dataObj = {name: category, y: categorySum, value: categorySum.toFixed(2)};
      pieData.push(dataObj);
    }
    this.expenseDataChart = pieData;
    this.expenseDataTable = parsedData;

    this.isDataReady = true;
    this.isLoadingExpenses = false;
  }

  getTotal(expenses: any): string {
    let categorySum = 0;
    for (const expense of expenses) {
      categorySum += expense.amount;
    }
    return categorySum.toFixed(2);
  }

  ngOnDestroy() {
    if (this.expenses) {
      this.expenses.unsubscribe();
    }
  }
}

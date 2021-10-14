import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Expense } from '../../shared/interfaces/expense-model';
import { DatabaseService } from '../../services/database.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-view-logged-expenses',
  templateUrl: './view-logged-expenses.component.html',
  styleUrls: ['./view-logged-expenses.component.scss']
})
export class ViewLoggedExpensesComponent implements OnInit, OnDestroy {
  expenseDataChart: { name: string, y: number, value: number }[] = [];
  expenseDataTable: Expense[] = [];
  metrics: {
    color?: string, value: string | number, metricTitle: string, icon?: string
  }[] = [];
  isLoadingExpenses = true;
  isDataReady = false;
  date = new Date(
    new Date().getFullYear(),
    new Date().getMonth() - 2,
    new Date().getDate()
  );
  categoryDate = new Date();
  categories: string[];

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
          this.getUserCategories();
        }).catch(e => {
      });
    }
  }

  checkDate(e: Date, prop: string) {
    this[prop] = e;
  }

  getUserCategories() {
    this.database.getCurrentCategories(this.loginService.getUserId())
      .then(jsonData => {
        const obj = jsonData.toJSON();
        const categoriesArr = Object.keys(obj).map((key) => obj[key]);
        this.loginService.setCategories(categoriesArr);
      }).catch(e => {
    })
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
    this.isLoadingExpenses = false;
    const parsedData = this.parseData(snapshots);


    const firstDate = new Date(Math.min.apply(null, parsedData.map((e) => new Date(e.date))));
    const lastDate = new Date(Math.max.apply(null, parsedData.map((e) => new Date(e.date))));
    const numOfEntries = parsedData.length;
    const totalAmount = this.getTotal(parsedData);


    this.metrics = [
      {color: null, value: firstDate.toDateString().slice(3, 15), metricTitle: 'First Expense Date', icon: 'today'},
      {color: null, value: lastDate.toDateString().slice(3, 15), metricTitle: 'Latest Expense Date', icon: 'today'},
      {color: null, value: numOfEntries, metricTitle: 'Number of Expenses', icon: 'receipt'},
      {color: 'money-icon', value: totalAmount, metricTitle: 'Total Amount', icon: 'attach_money'},
    ];

    this.categories = parsedData
      .map(item => item.category)
      .filter((value, index, self) => self.indexOf(value) === index);

    const pieData = [];

    for (const category of this.categories) {
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

  getCategoryTotals(expenses: Expense[]) {
    const categories = expenses
      .map(item => item.category)
      .filter((value, index, self) => self.indexOf(value) === index);
    const totals = [];

    for (const category of categories) {
      let categorySum = 0;
      for (const value of expenses) {
        if (value.category === category) {
          categorySum += value.amount as number;
        }
      }
      const dataObj = {name: category, amount: categorySum.toFixed(2)};
      totals.push(dataObj);
    }
    return totals.toString();
  }

  ngOnDestroy() {
    if (this.expenses) {
      this.expenses.unsubscribe();
    }
  }
}

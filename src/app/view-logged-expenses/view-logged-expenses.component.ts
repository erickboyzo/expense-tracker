import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { LoginService } from '../services/login.service';
import { Subscription } from 'rxjs';
import { Expense } from '../models/expense-model';

@Component({
  selector: 'app-view-logged-expenses',
  templateUrl: './view-logged-expenses.component.html',
  styleUrls: ['./view-logged-expenses.component.scss']
})
export class ViewLoggedExpensesComponent implements OnInit, OnDestroy {

  expenseDataChart: any = [];
  expenseDataTable: Expense[] = [];
  isLoadingExpenses = false;
  isDataReady = false;

  private expenses: Subscription;

  constructor(private database: DatabaseService,
              private loginService: LoginService) {
    loginService.userIdSetAnnounced$.subscribe(
      category => {
        console.log(category);
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
    const userId = this.loginService.getUserId();
    this.isLoadingExpenses = true;
    if (userId) {
      this.expenses = this.database.getUserExpenses(userId)
        .subscribe(snapshots => this.filterData(snapshots));
    }  else {
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

    const categories = parsedData.map(item => item.category)
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

  ngOnDestroy() {
    if (this.expenses) {
      this.expenses.unsubscribe();
    }
  }
}

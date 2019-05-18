import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatabaseService } from '../providers/database.service';
import { LoginService } from '../providers/login.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-logged-expenses',
  templateUrl: './view-logged-expenses.component.html',
  styleUrls: ['./view-logged-expenses.component.less']
})
export class ViewLoggedExpensesComponent implements OnInit, OnDestroy {

  expenseDataChart: any = [];
  expenseDataCards: any = [];
  expenseDataTable: any = [];
  private expenses: Subscription;
  isLoadingExpenses=false;
  isDataReady = false;

  constructor(private database: DatabaseService,
              private loginService: LoginService) {
    loginService.userIdSetAnnounced$.subscribe(
      category => {
        this.getUserExpenses();
      });
  }

  ngOnInit() {
    this.getUserExpenses();
    setTimeout(() => this.scrollTop(),);
  }

  scrollTop() {
    var element = document.getElementById('content');
    element.scrollIntoView();
  }

  getUserExpenses() {
    let userId = this.loginService.getUserId();
    this.isLoadingExpenses = true;
    if (userId) {
      this.expenses = this.database.getUserExpenses(userId)
        .subscribe(snapshots => this.filterData(snapshots));
    }  else {
      this.isLoadingExpenses = true;
    }

  }

  parseData(snapsShots: any) {
    let data = [];
    console.log(snapsShots);
    snapsShots.forEach(snapshot => {
      let expense = snapshot.payload.exportVal();
      console.log(expense);
      expense.id = snapshot.key;
      data.push(expense);
    });
    return data;
  }

  filterData(snapshots) {
    console.log(snapshots);
    this.isLoadingExpenses = true;

    let parsedData = this.parseData(snapshots);

    const categories = parsedData.map(item => item.category)
      .filter((value, index, self) => self.indexOf(value) === index);

    let pieData = [];

    for (let category of categories) {
      let categorySum = 0;
      for (let value of parsedData) {
        if (value.category == category) {
          categorySum += value.amount;
        }
      }
      let dataObj = {name: category, y: categorySum, value: categorySum.toFixed(2)};
      pieData.push(dataObj);
    }
    this.expenseDataChart = pieData;
    this.expenseDataTable = parsedData;
    console.log(this.expenseDataChart);

    this.isDataReady = true;
    this.isLoadingExpenses = false;
  }

  ngOnDestroy() {
    if (this.expenses) {
      this.expenses.unsubscribe();
    }

  }

}

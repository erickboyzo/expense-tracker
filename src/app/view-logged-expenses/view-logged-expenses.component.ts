import {Component, OnInit, AfterViewChecked, OnDestroy} from '@angular/core';
import {expense_types, expense_categories} from "../models/user-model";
import {DatabaseService} from "../providers/database.service";
import {LoginService} from "../providers/login.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-view-logged-expenses',
  templateUrl: './view-logged-expenses.component.html',
  styleUrls: ['./view-logged-expenses.component.less']
})
export class ViewLoggedExpensesComponent implements OnInit, OnDestroy {

  expenseDataChart: any = [];
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

    if(userId){
      this.expenses=this.database.getUserExpenses(userId).do(snapshots => {
        this.isLoadingExpenses=true;
      })
        .subscribe(snapshots => this.filterData(snapshots));
    }
    else{
      this.isLoadingExpenses=true;
    }

  }

  parseData(snapsShots: any) {
    let data = [];
    snapsShots.forEach(snapshot => {
      let expense = snapshot.val();
      expense.id = snapshot.key;
      data.push(expense);
    });
    return data;
  }

  filterData(snapshots) {
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
      let dataObj = {name: category, y: categorySum};
      pieData.push(dataObj);
    }
    this.expenseDataChart = pieData;
    this.expenseDataTable = parsedData;

    this.isDataReady = true;
    this.isLoadingExpenses = false;
  }

  ngOnDestroy() {
    if(this.expenses){
      this.expenses.unsubscribe();
    }

  }

}

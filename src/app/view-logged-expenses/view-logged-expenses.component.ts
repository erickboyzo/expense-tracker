import { Component, OnInit } from '@angular/core';
import {expense_types, expense_categories} from "../models/user-model";
import {DatabaseService} from "../providers/database.service";
import {LoginService} from "../providers/login.service";

@Component({
  selector: 'app-view-logged-expenses',
  templateUrl: './view-logged-expenses.component.html',
  styleUrls: ['./view-logged-expenses.component.less']
})
export class ViewLoggedExpensesComponent implements OnInit {


  public expenseDataChart:any= {pieChartLabels:[],pieChartData:[],pieChartType:'pie'};
  public expenseDataTable: any = [];

  constructor(private database: DatabaseService, private loginService: LoginService) { }

  ngOnInit() {
    this.getUserExpenses();
  }

  getUserExpenses(){

    let userId = this.loginService.getUserId();
    this.database.getUserExpenses(userId).do(snapshots => {
      snapshots.forEach(snapshot =>
      this.storeExpenses(snapshot))
      })
      .subscribe(snapshots => this.filterData());
  }

  storeExpenses(obj:any){
    console.log(obj.toJSON());
    this.expenseDataTable.push(obj.toJSON());
  }

  filterData(){
    console.log('data is done');
    console.log(this.expenseDataTable);
    const categories = this.expenseDataTable.map(item => item.category)
      .filter((value, index, self) => self.indexOf(value) === index);

    console.log(categories);

  }

}

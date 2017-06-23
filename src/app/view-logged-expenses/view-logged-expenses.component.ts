import { Component, OnInit } from '@angular/core';
import {expense_types, expense_categories} from "../models/user-model";

@Component({
  selector: 'app-view-logged-expenses',
  templateUrl: './view-logged-expenses.component.html',
  styleUrls: ['./view-logged-expenses.component.less']
})
export class ViewLoggedExpensesComponent implements OnInit {

  public doughnutChartLabels: string[] = expense_categories;
  public doughnutChartData: number[] = [350, 450, 100, 400];
  public doughnutChartType: string = 'doughnut';

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  constructor() { }

  ngOnInit() {
  }

}

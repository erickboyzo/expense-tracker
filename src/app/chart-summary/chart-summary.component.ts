import {Component, OnInit, Input, OnChanges} from '@angular/core';
import {expense_categories} from "../models/user-model";

@Component({
  selector: 'app-chart-summary',
  templateUrl: './chart-summary.component.html',
  styleUrls: ['./chart-summary.component.less']
})
export class ChartSummaryComponent implements OnInit, OnChanges {

  @Input() data: any;

  public pieChartLabels: string[] = expense_categories;
  public pieChartData: number[] = [350, 450, 100, 400];
  public pieChartType: string = 'pie';


  constructor() {
  }


  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }


  ngOnInit() {

    console.log(this.data);
  }

  ngOnChanges(changes: any) {

    console.log(changes);
    if(!changes.data.firstChange){
      this.pieChartData = changes.data.currentValue;
    }

  }

}

import {Component, OnInit, Input, OnChanges} from '@angular/core';


@Component({
  selector: 'app-table-summary',
  templateUrl: './table-summary.component.html',
  styleUrls: ['./table-summary.component.less']
})
export class TableSummaryComponent implements OnInit, OnChanges {

  @Input() data: any;

  public expensesData: any;
  public activePage: number = 10;

  constructor() {
  }

  ngOnInit() {
    this.expensesData = this.data;
  }

  ngOnChanges(changes: any) {
    console.log(changes);
    if(!changes.data.firstChange){
      this.expensesData = changes.data.currentValue;
    }


  }

}

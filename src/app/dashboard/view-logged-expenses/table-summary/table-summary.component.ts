import { Component, Input, OnChanges, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { ManageExpenseComponent } from '../../manage-expense/manage-expense.component';
import { MatDialog } from '@angular/material';


@Component({
  selector: 'app-table-summary',
  templateUrl: 'table-summary.component.html',
  styleUrls: ['table-summary.component.scss']
})
export class TableSummaryComponent implements OnInit, OnChanges {

  @Input() data: any;

  expensesData: any;
  activePage: number = 1;

  constructor(private router: Router,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.expensesData = this.data;
  }

  ngOnChanges(changes: any) {
    console.log(changes);
    if (!changes.data.firstChange) {
      this.expensesData = changes.data.currentValue;
    }
  }

  isDataEmpty(): boolean {
    return this.data.length === 0;
  }

  editData(expense: any) {
    let dialogRef = this.dialog.open(ManageExpenseComponent, {
      data: expense,
      hasBackdrop: true,
      disableClose: true,
    });
  }
}

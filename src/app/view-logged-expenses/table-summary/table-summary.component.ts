import {Component, OnInit, Input, OnChanges, Renderer} from '@angular/core';


import {Router} from "@angular/router";
import {MdDialog} from "@angular/material";
import {LogExpenseComponent} from "../../log-expense/log-expense.component";
import {ManageExpenseComponent} from "../../manage-expense/manage-expense.component";
import {MdlDialogService, MdlDialogReference} from "@angular-mdl/core";


@Component({
  selector: 'app-table-summary',
  templateUrl: 'table-summary.component.html',
  styleUrls: ['table-summary.component.less']
})
export class TableSummaryComponent implements OnInit, OnChanges {

  @Input() data: any;

  expensesData: any;
  activePage: number = 10;

  constructor(private router: Router,
              public dialog: MdDialog) {
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

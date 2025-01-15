import { Component, OnInit } from '@angular/core';
import { ExpenseImportGridComponent } from '../expense-import-grid/expense-import-grid.component';
import { ExpenseImportModel } from '../expense-import.model';

@Component({
  selector: 'app-expense-import-guidance',
  templateUrl: './expense-import-guidance.component.html',
  imports: [ExpenseImportGridComponent],
  styleUrls: ['./expense-import-guidance.component.scss'],
})
export class ExpenseImportGuidanceComponent implements OnInit {
  guidanceData: ExpenseImportModel[] = [
    <ExpenseImportModel>{
      date: 'Required format MM/DD/YYYY',
      description: 'Required',
      amount: 'Required',
      category: 'Not required. Defaults to Unassigned',
      type: 'Not required. Defaults to Debit. Valid Values: Debit, Credit or Cash',
      comments: 'Not required',
    },
  ];

  constructor() {}

  ngOnInit() {}
}

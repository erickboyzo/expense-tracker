import { Component, OnInit } from '@angular/core';
import { displayedColumns } from '../expense-import.model';

@Component({
  selector: 'app-expense-import-guidance',
  templateUrl: './expense-import-guidance.component.html',
  styleUrls: ['./expense-import-guidance.component.less']
})
export class ExpenseImportGuidanceComponent implements OnInit {
  displayedColumns: string[] = displayedColumns;
  dataRequirements: string[] = [
    '<span class="font-weight-bold">date</span> : Required format MM/DD/YYYY',
    '<span class="font-weight-bold">description</span> : Required',
    '<span class="font-weight-bold">amount</span> : Required',
    '<span class="font-weight-bold">category</span> : Not required. Defaults to Unassigned',
    '<span class="font-weight-bold">type</span> : Not required. Defaults to Debit. Valid Values: Debit, Credit or Cash',
    '<span class="font-weight-bold">comments</span> : Not required'
  ];

  constructor() { }

  ngOnInit() {
  }

}

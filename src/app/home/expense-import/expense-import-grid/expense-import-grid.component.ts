import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';

import { displayedColumns, ExpenseImportModel } from '../expense-import.model';


@Component({
  selector: 'app-expense-import-grid',
  templateUrl: './expense-import-grid.component.html',
  styleUrls: ['./expense-import-grid.component.scss']
})
export class ExpenseImportGridComponent implements OnInit, OnChanges {
  @Input() data: ExpenseImportModel[] = [];
  @Input() referenceOnly = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Output() saveAction: EventEmitter<void> = new EventEmitter();
  displayedColumns: string[] = displayedColumns;
  dataSource = new MatTableDataSource<ExpenseImportModel>([]);
  init = false;
  filterErrors = false;

  get errorsPresent(): boolean {
    return this.data.filter(expense => expense.error).length > 0
  }


  ngOnInit() {
    this.setDataSource();
    this.init = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data && !changes.data.isFirstChange()) {
      this.filterErrors = false;
      this.setDataSource();
    }
  }

  onErrorButtonClick() {
    this.filterErrors = !this.filterErrors;
    this.filterErrors ? this.setDataSourceErrorsOnly() : this.setDataSource();
  }

  private setDataSource() {
    this.dataSource = new MatTableDataSource<ExpenseImportModel>(this.data);
    this.dataSource.paginator = this.paginator;
  }

  private setDataSourceErrorsOnly() {
    this.dataSource = new MatTableDataSource<ExpenseImportModel>(this.data.filter(e => e.error));
    this.dataSource.paginator = this.paginator;
  }

  saveImportedExpenses() {
    this.saveAction.emit();
  }
}

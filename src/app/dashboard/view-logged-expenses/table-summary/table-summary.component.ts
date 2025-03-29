import { SelectionModel } from '@angular/cdk/collections';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { AfterViewInit, Component, inject, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatChip } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { Expense } from '../../../shared/interfaces/expense-model';
import { BulkEditDialogResult } from '../../interfaces/bulk-edit-dialog-data';
import { ManageExpenseComponent } from '../../manage-expense/manage-expense.component';
import { BulkEditModalComponent } from '../../bulk-edit-modal/bulk-edit-modal.component';

@Component({
  selector: 'app-table-summary',
  templateUrl: 'table-summary.component.html',
  imports: [
    MatTableModule,
    NgClass,
    MatButton,
    MatIcon,
    MatCheckbox,
    MatChip,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    FormsModule,
    DatePipe,
    MatSortModule,
    MatPaginatorModule,
    CurrencyPipe,
  ],
  styleUrls: ['table-summary.component.scss'],
})
export class TableSummaryComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild('sorter', { static: true }) sort!: MatSort;
  @Input() data: Expense[] = [];
  @Input() displayColumns: string[] = ['select', 'name', 'amount', 'date', 'category', 'type', 'details'];

  expensesData = new MatTableDataSource<Expense>();
  selection = new SelectionModel<Expense>(true, []);
  isAllSelected = false;
  category = [];

  private snackBar = inject(MatSnackBar);

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    this.expensesData = new MatTableDataSource<Expense>(this.data);
    this.sort.active = 'date';
    this.sort.direction = 'asc';
    this.expensesData.paginator = this.paginator;
    this.expensesData.sort = this.sort;
  }

  toggleHeaderCheckbox() {
    if (this.isAllSelected) {
      this.selection.clear();
    } else {
      this.expensesData.data.forEach((row) => this.selection.select(row));
    }
    this.isAllSelected = this.areAllChecked();
  }

  areAllChecked() {
    const numSelected = this.selection.selected.length;
    const numRows = this.expensesData.data.length;
    return numSelected === numRows;
  }

  toggleSelection(row: Expense) {
    this.selection.toggle(row);
    this.isAllSelected = this.areAllChecked();
  }

  ngAfterViewInit() {
    this.expensesData.paginator = this.paginator;
    this.expensesData.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['data'].firstChange) {
      this.expensesData = new MatTableDataSource<Expense>(this.data);
      this.expensesData.paginator = this.paginator;
      this.expensesData.sort = this.sort;
    }
  }

  isDataEmpty(): boolean {
    return this.data.length === 0;
  }

  editData(expense: Expense) {
    const dialogRef = this.dialog.open(ManageExpenseComponent, {
      data: expense,
      hasBackdrop: true,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe();
  }

  openBulkEditDialog(editType: 'category' | 'type' | 'delete'): void {
    const title =
      editType === 'category' ? 'Update Category' : editType === 'type' ? 'Update Payment Type' : 'Delete Expenses';
    const confirmButtonText = editType === 'delete' ? 'Delete Expenses' : 'Save Changes';
    const dialogRef = this.dialog.open(BulkEditModalComponent, {
      width: '500px',
      data: {
        title,
        confirmButtonText,
        editType,
        expenses: [...this.selection.selected],
        cancelButtonText: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe(({ successful, error }: BulkEditDialogResult) => {
      if (successful) {
        if (successful === this.selection.selected.length && editType === 'delete') {
          this.snackBar.open('Expenses successfully deleted.', 'Close', {
            duration: 3000,
          });
          this.selection.clear();
        } else if (successful === this.selection.selected.length && editType !== 'delete') {
          this.snackBar.open('Expenses successfully updated.', 'Close', {
            duration: 3000,
          });
          this.selection.clear();
        }
      } else {
        this.snackBar.open('Error: ' + error, 'Close', {
          duration: 3000,
        });
      }
    });
  }
}

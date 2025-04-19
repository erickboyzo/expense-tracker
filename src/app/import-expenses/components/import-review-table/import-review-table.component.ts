import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule, CurrencyPipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  effect,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { Expense } from '@core/interfaces/expense-model';
import { BulkEditModalComponent } from '@shared/components/bulk-edit-modal/bulk-edit-modal.component';
import { ManageExpenseComponent } from '@shared/components/manage-expense/manage-expense.component';
import { BulkEditDialogResult } from '../../../dashboard/interfaces/bulk-edit-dialog-data';

@Component({
  selector: 'app-import-review-table',
  imports: [
    CurrencyPipe,
    CommonModule,
    MatTableModule,
    MatTabsModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatCheckbox,
  ],
  templateUrl: './import-review-table.component.html',
  styleUrl: './import-review-table.component.scss',
})
export class ImportReviewTableComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild('expensesSort', { static: true }) sort!: MatSort;

  @Input() expenses = signal<Expense[]>([]);
  @Output() expensesChange = new EventEmitter<Expense[]>();

  expensesDataSource = new MatTableDataSource<Expense>();
  displayedColumns = ['select', 'date', 'name', 'amount', 'category', 'type', 'comments', 'actions'];
  selection = new SelectionModel<Expense>(true, []);
  isAllSelected = false;

  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  constructor() {
    effect(() => {
      console.table(this.expenses());
      this.expensesDataSource.data = this.expenses();
      this.expensesDataSource.paginator = this.paginator;
      this.expensesDataSource.sort = this.sort;
      this.expensesChange.emit([...this.expenses()]);
      this.selection.clear();
    });
  }

  ngOnInit() {
    this.sort.active = 'date';
    this.sort.direction = 'asc';
  }

  ngAfterViewInit() {
    this.expensesDataSource.paginator = this.paginator;
    this.expensesDataSource.sort = this.sort;
  }

  deleteRow(expense: Expense) {
    const title = 'Delete Expense';
    const confirmButtonText = 'Delete Expense';
    const dialogRef = this.dialog.open(BulkEditModalComponent, {
      width: '500px',
      data: {
        title,
        confirmButtonText,
        editType: 'delete',
        expenses: [expense],
        cancelButtonText: 'Cancel',
        previewOnly: true,
      },
    });

    dialogRef.afterClosed().subscribe(({ editForm }: BulkEditDialogResult) => {
      if (!editForm) {
        this.snackBar.open('Expense successfully deleted.', 'Close', {
          duration: 3000,
        });
        const { id } = expense;
        this.expensesDataSource.data = this.expensesDataSource.data.filter((expense) => id !== expense.id);
        this.expensesChange.emit(this.expensesDataSource.data);
      }
    });
  }

  toggleHeaderCheckbox() {
    if (this.isAllSelected) {
      this.selection.clear();
    } else {
      this.expensesDataSource.data.forEach((row: Expense) => this.selection.select(row));
    }
    this.isAllSelected = this.areAllChecked();
  }

  areAllChecked() {
    const numSelected = this.selection.selected.length;
    const numRows = this.expensesDataSource.data.length;
    return numSelected === numRows;
  }

  toggleSelection(row: Expense) {
    this.selection.toggle(row);
    this.isAllSelected = this.areAllChecked();
  }

  editRow(expense: Expense) {
    const dialogRef = this.dialog.open(ManageExpenseComponent, {
      data: { expense, previewDataMode: true },
      hasBackdrop: true,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((expense) => {
      if (expense) {
        this.expensesDataSource.data = this.expensesDataSource.data.map((e) => (e.id === expense.id ? expense : e));
        this.expensesChange.emit(this.expensesDataSource.data);
        this.snackBar.open('Expense successfully updated.', 'Close', {
          duration: 3000,
        });
      }
    });
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
        previewOnly: true,
      },
    });

    dialogRef.afterClosed().subscribe((result: BulkEditDialogResult) => {
      if (!result) {
        return;
      }
      const { editForm } = result;
      if (!editForm && editType === 'delete') {
        this.snackBar.open('Expenses successfully deleted.', 'Close', {
          duration: 3000,
        });
        const idsToDelete = this.selection.selected.map((expense) => expense.id);
        this.expensesDataSource.data = this.expensesDataSource.data.filter(
          (expense) => !idsToDelete.includes(expense.id),
        );
        this.expensesChange.emit(this.expensesDataSource.data);
        this.selection.clear();
      } else if (editForm && editType !== 'delete') {
        this.expensesDataSource.data = this.expensesDataSource.data.map((expense) => {
          const expenseToUpdate = this.selection.selected.find((e) => e.id === expense.id);
          return expenseToUpdate ? { ...expenseToUpdate, ...editForm } : expense;
        });
        this.expensesChange.emit(this.expensesDataSource.data);
        this.snackBar.open('Expenses successfully updated.', 'Close', {
          duration: 3000,
        });
        this.selection.clear();
      }
    });
  }
}

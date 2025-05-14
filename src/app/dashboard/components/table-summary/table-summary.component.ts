import { SelectionModel } from '@angular/cdk/collections';
import { CurrencyPipe, DatePipe, NgClass, NgForOf } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  Input,
  OnInit,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatChip, MatChipListbox, MatChipOption } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { Expense } from '@core/interfaces/expense-model';
import { BulkEditModalComponent } from '@shared/components/bulk-edit-modal/bulk-edit-modal.component';
import { ManageExpenseComponent } from '@shared/components/manage-expense/manage-expense.component';
import { startWith } from 'rxjs';
import { BulkEditDialogResult } from '../../interfaces/bulk-edit-dialog-data';

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
    MatChipListbox,
    MatChipOption,
    NgForOf,
    ReactiveFormsModule,
    MatLabel,
    MatDivider,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['table-summary.component.scss'],
})
export class TableSummaryComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild('sorter', { static: true }) sort!: MatSort;
  @Input() data: WritableSignal<Expense[]> = signal([]);
  @Input() displayColumns: string[] = ['select', 'name', 'amount', 'date', 'category', 'type', 'details'];

  expensesData = new MatTableDataSource<Expense>();
  selection = new SelectionModel<Expense>(true, []);
  isAllSelected = false;
  category = [];
  showFilters = signal(false);
  selectedFilters = new FormControl<string[]>([]);
  selectedSourceFilters = new FormControl<string[]>([]);
  filterCategories = computed(() => {
    const categories = this.data().map((expense) => expense.category);
    return [...new Set(categories)];
  });
  filterSources = computed(() => {
    const sources = this.data().map((expense) => expense.type);
    return [...new Set(sources)];
  });
  readonly categoryFilterValues = toSignal(
    this.selectedFilters.valueChanges.pipe(startWith(this.selectedFilters.value || [])),
    { initialValue: [] as string[] },
  );
  readonly sourceFilterValues = toSignal(
    this.selectedSourceFilters.valueChanges.pipe(startWith(this.selectedSourceFilters.value || [])),
    { initialValue: [] as string[] },
  );
  filteredData = computed(() => {
    const data = this.data();
    const categoryFilters = this.categoryFilterValues();
    const sourceFilters = this.sourceFilterValues();

    if (!categoryFilters?.length && !sourceFilters?.length) {
      return data;
    }

    return data.filter((expense) => {
      const matchesCategory = !categoryFilters?.length || categoryFilters.includes(expense.category);
      const matchesSource = !sourceFilters?.length || sourceFilters.includes(expense.type);
      return matchesCategory && matchesSource;
    });
  });

  private snackBar = inject(MatSnackBar);
  private init = false;
  private dataEffect = effect(() => {
    if (!this.init) return;
    this.resetFilters();
    this.updateTableData(this.data());
  });
  private filterEffect = effect(() => {
    const filteredExpenses = this.filteredData();
    this.updateTableData(filteredExpenses);
  });

  private dialog = inject(MatDialog);

  ngOnInit() {
    this.updateTableData(this.data());
    this.init = true;
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

  editData(expense: Expense) {
    const dialogRef = this.dialog.open(ManageExpenseComponent, {
      width: '600px',
      data: { expense },
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

  toggleFilters() {
    this.showFilters.update((value) => !value);
  }

  private updateTableData(data: Expense[]) {
    this.expensesData = new MatTableDataSource<Expense>(data);
    this.sort.active = 'date';
    this.sort.direction = 'asc';
    this.expensesData.paginator = this.paginator;
    this.expensesData.sort = this.sort;
    this.selection.clear();
  }

  private resetFilters() {
    this.selectedFilters.reset();
    this.selectedSourceFilters.reset();
  }
}

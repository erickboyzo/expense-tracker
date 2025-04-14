import { CurrencyPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { Component, effect, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Expense } from '../../../core/interfaces/expense-model';
import { DatabaseService } from '../../../core/services/database.service';
import { ExpenseDataService } from '../../../core/services/expense-data.service';
import { UserService } from '../../../core/services/user.service';
import { BulkEditDialogData } from '../../../dashboard/interfaces/bulk-edit-dialog-data';

@Component({
  selector: 'app-bulk-edit-modal',
  imports: [
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    NgIf,
    NgForOf,
    MatTableModule,
    DatePipe,
    CurrencyPipe,
  ],
  templateUrl: './bulk-edit-modal.component.html',
  styleUrl: './bulk-edit-modal.component.scss',
})
export class BulkEditModalComponent implements OnInit {
  editForm!: FormGroup;
  categories: string[] = [];
  paymentTypes: string[] = [];
  selectedExpenses!: MatTableDataSource<Expense>;
  displayedColumns: string[] = [];

  private expenseDataService = inject(ExpenseDataService);
  private databaseService = inject(DatabaseService);
  private userService = inject(UserService);
  private expenseDataUpdate = effect(() => {
    this.categories = this.expenseDataService.categoriesSignal();
    this.paymentTypes = this.expenseDataService.expenseSourcesSignal();
  });

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<BulkEditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BulkEditDialogData,
  ) {}

  ngOnInit() {
    if (this.data.editType === 'category') {
      this.editForm = this.fb.group({
        category: ['', Validators.required],
      });
      this.displayedColumns = ['name', 'amount', 'date', 'category'];
    } else if (this.data.editType === 'type') {
      this.editForm = this.fb.group({
        type: ['', Validators.required],
      });
      this.displayedColumns = ['name', 'amount', 'date', 'type'];
    } else {
      this.displayedColumns = ['name', 'amount', 'date', 'category'];
    }

    this.selectedExpenses = new MatTableDataSource(this.data.expenses);
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  bulkDelete() {
    if (this.data.previewOnly) {
      this.dialogRef.close({ expenses: this.data.expenses });
    } else {
      const userId = this.userService.getUserId();
      const updates: Record<string, null> = {};
      this.data.expenses.forEach(({ id: expenseId }) => {
        updates[`users/${userId}/expenses/${expenseId}`] = null;
      });
      this.databaseService
        .batchUpdateExpenses(updates)
        .then(() => this.dialogRef.close({ successful: this.data.expenses.length }))
        .catch((error) => this.dialogRef.close({ error }));
    }
  }

  bulkUpdate() {
    if (this.data.previewOnly) {
      this.dialogRef.close({ editForm: this.editForm.value });
    } else {
      const { type, category } = this.editForm.value;
      const userId = this.userService.getUserId();
      const updates: Record<string, Expense> = {};
      this.data.expenses.forEach((expense) => {
        const { id, ...expenseObj } = expense;
        if (type) {
          expenseObj.type = type;
        } else {
          expenseObj.category = category;
        }
        updates[`users/${userId}/expenses/${id}`] = expenseObj;
      });
      this.databaseService
        .batchUpdateExpenses(updates)
        .then(() => this.dialogRef.close({ successful: this.data.expenses.length }))
        .catch((error) => this.dialogRef.close({ error }));
    }
  }
}

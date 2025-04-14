import { CommonModule } from '@angular/common';
import { Component, effect, Input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { Expense } from '../../../core/interfaces/expense-model';
import { ReviewedExpenses } from '../../interfaces/import-interfaces';
import { ImportReviewTableComponent } from '../import-review-table/import-review-table.component';

@Component({
  selector: 'app-file-import-review',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatTabsModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ImportReviewTableComponent,
  ],
  templateUrl: './file-import-review.component.html',
  styleUrl: './file-import-review.component.scss',
})
export class FileImportReviewComponent {
  @Input() expenses = signal<Expense[]>([]);
  @Input() reviewedExpensesToSave = signal<ReviewedExpenses>({
    debits: [],
    credits: [],
  });

  debitExpenses = signal<Expense[]>([]);
  creditExpenses = signal<Expense[]>([]);
  private expensesUpdated = effect(() => this.filterExpensesBySource(this.expenses()));

  updateReviewedExpensesToSave(source: 'debits' | 'credits', expenses: Expense[]): void {
    this.reviewedExpensesToSave.update((prev) => ({ ...prev, [source]: expenses }));
  }

  private filterExpensesBySource(expenses: Expense[]) {
    const debits: Expense[] = [];
    const credits: Expense[] = [];
    expenses.forEach((expense: Expense, index: number) => {
      if ((expense.amount as number) < 0) {
        credits.push({ ...expense, id: `${index + 1}-credit` });
      } else {
        debits.push({ ...expense, id: `${index + 1}-debit` });
      }
    });
    this.debitExpenses.set(debits);
    this.creditExpenses.set(credits);
  }
}

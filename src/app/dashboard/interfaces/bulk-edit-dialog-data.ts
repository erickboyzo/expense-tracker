import { Expense } from '../../shared/interfaces/expense-model';

export interface BulkEditDialogData {
  title: string;
  expenses: Expense[]
  confirmButtonText: string;
  cancelButtonText: string;
  editType: 'category' | 'type' | 'delete';
}

export interface BulkEditDialogResult {
  successful?: number;
  error?: string;
}

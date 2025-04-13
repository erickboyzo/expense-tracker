import { Expense } from '../../core/interfaces/expense-model';

export interface BulkEditDialogData {
  title: string;
  expenses: Expense[];
  confirmButtonText: string;
  cancelButtonText: string;
  editType: 'category' | 'type' | 'delete';
  previewOnly?: boolean;
}

export interface BulkEditDialogResult {
  successful?: number;
  error?: string;
  editForm?: Record<string, string>;
}

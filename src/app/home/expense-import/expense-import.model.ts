import { Expense } from '../../shared/interfaces/expense-model';

export interface ExpenseImportModel extends Expense {
  error?: boolean;
  description?: string;
}

export const displayedColumns: string[] = ['date', 'description', 'amount', 'category', 'type', 'comments'];
export const requiredColumns: string[] = ['Date', 'Description', 'Amount'];


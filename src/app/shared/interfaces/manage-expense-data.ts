import { Expense } from '@core/interfaces/expense-model';

export interface ManageExpenseData {
  expense: Expense;
  update?: boolean;
  previewDataMode?: boolean;
}

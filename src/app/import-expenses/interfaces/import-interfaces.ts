import { Expense } from '../../core/interfaces/expense-model';

export type CsvRow = Record<string, string>;

export type ExpenseKey = keyof Expense;

type ExpenseMapping = Partial<Record<ExpenseKey, string>>;

export interface FormMapping extends ExpenseMapping {
  handleNegativeAmounts: 'omit' | 'credit' | 'debit';
}

export interface ReviewedExpenses {
  debits: Expense[];
  credits: Expense[];
}

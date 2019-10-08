export interface User {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  expensesEntered?: number;
  lastLogin?: string;
  creationDate?: string;
}

export interface ExpensesInfo {
  numOfEntries: string | number;
  totalAmount: string;
  categoryTotals: string;
  selectedCategory: string;
  umOfEntries?: any;
  firstExpenseDate?: string;
  lastExpenseDate?: string;
}

export const expense_categories: string[] = ['Groceries', 'Transportation', 'Entertainment', 'Dining out', 'Unassigned'];
export const expense_types: string[] = ['Credit', 'Debit', 'Cash'];

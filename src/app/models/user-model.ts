export class User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  enterExpenses: any;
}

export interface ExpenseInfo {
  numOfEntries: string;
  totalAmount: string;
  categoryTotals: string;
  selectedCategory: string;
}

export const expense_categories: string[] = ['Groceries', 'Transportation', 'Entertainment', 'Dining out', 'Unassigned'];
export const expense_types: string[] = ['Credit', 'Debit', 'Cash'];

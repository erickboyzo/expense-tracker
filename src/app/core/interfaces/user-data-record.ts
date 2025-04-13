import { Expense } from './expense-model';

export interface UserDataRecord {
  firstName: string;
  lastName: string;
  categories?: Record<string, string>;
  types?: Record<string, string>;
  expenses?: Record<string, Expense>;
  filesImported?: Record<string, string>;
}

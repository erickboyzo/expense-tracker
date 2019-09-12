export interface ExpenseImportModel {
  date: string;
  description: string;
  amount: string | number;
  category?: string;
  type?: string;
  comments?: string;
  name?: string;
  error?: boolean;
}

export const displayedColumns: string[] = ['date', 'description', 'amount', 'category', 'type', 'comments'];
export const requiredColumns: string[] = ['date', 'description', 'amount'];


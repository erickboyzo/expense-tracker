export interface Expense {
  id?: string;
  name: string;
  date: Date | string;
  category: string;
  type: string;
  amount: number;
  comments?: string;
}

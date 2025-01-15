import { Injectable, signal, WritableSignal } from '@angular/core';
import { Expense } from '../interfaces/expense-model';

@Injectable({
  providedIn: 'root',
})
export class ExpenseDataService {
  private readonly _expensesSignal = signal<Expense[]>([]);
  private readonly _sourceTypesSignal = signal<string[]>([]);
  private readonly _categoriesSignal = signal<string[]>([]);

  get expensesSignal(): WritableSignal<Expense[]> {
    return this._expensesSignal;
  }

  get expenseSourcesSignal(): WritableSignal<string[]> {
    return this._sourceTypesSignal;
  }

  get categoriesSignal(): WritableSignal<string[]> {
    return this._categoriesSignal;
  }

  setExpensesData(expenses: Expense[]) {
    this._expensesSignal.set(expenses);
  }

  setExpenseSourcesData(expenseSources: string[]) {
    this._sourceTypesSignal.set(expenseSources);
  }

  setCategoriesSignal(categories: string[]) {
    this._categoriesSignal.set(categories);
  }
}

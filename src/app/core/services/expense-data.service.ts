import { computed, Injectable, signal, WritableSignal } from '@angular/core';
import { EntryTypes } from '@core/enums/entry-types';
import { endOfDay, isWithinInterval, startOfDay } from 'date-fns';
import { TimeFrameFilter } from '../interfaces/time-frame-filter';
import { Expense } from '../interfaces/expense-model';

@Injectable({
  providedIn: 'root',
})
export class ExpenseDataService {
  showFilter = signal(false);
  private readonly _expensesSignal = signal<Expense[]>([]);
  private readonly _sourceTypesSignal = signal<string[]>([]);
  private readonly _categoriesSignal = signal<string[]>([]);
  private readonly _timeFrameFilter = signal<TimeFrameFilter | undefined>(undefined);
  private readonly _filesImported = signal<string[]>([]);
  private readonly _expenseEntryTypeFilter = signal<string | undefined>(undefined);

  readonly filteredExpenses = computed(() => {
    const timeFilter = this._timeFrameFilter();
    const entryTypeFilter = this._expenseEntryTypeFilter();
    const expenses = this.filterExpensesByEntryType(this._expensesSignal(), entryTypeFilter);

    if (!timeFilter || !expenses.length) {
      return expenses;
    }

    if (timeFilter.customDateRange) {
      return this.filterByCustomDateRange(expenses, timeFilter);
    }

    return this.filterByTimeFrame(expenses, timeFilter);
  });

  private filterExpensesByDateInterval(expenses: Expense[], start: Date, end: Date): Expense[] {
    const interval = {
      start: startOfDay(start),
      end: endOfDay(end),
    };

    return expenses.filter((expense) => {
      const expenseDate = this.parseExpenseDate(expense);
      return isWithinInterval(expenseDate, interval);
    });
  }

  private parseExpenseDate(expense: Expense): Date {
    return expense.date instanceof Date ? expense.date : new Date(expense.date);
  }

  private filterExpensesByEntryType(expenses: Expense[], entryTypeFilter: string | undefined): Expense[] {
    if (!entryTypeFilter) {
      return expenses;
    }

    if (entryTypeFilter === EntryTypes.MANUAL) {
      return expenses.filter((expense) => !expense.importedOn);
    }

    return expenses.filter((expense) => expense?.importedOn);
  }

  private filterByCustomDateRange(expenses: Expense[], timeFilter: TimeFrameFilter): Expense[] {
    const { customDateRange } = timeFilter;
    const { start, end } = customDateRange ?? {};

    if (!start || !end) {
      return expenses;
    }

    return this.filterExpensesByDateInterval(expenses, start, end);
  }

  private filterByTimeFrame(expenses: Expense[], timeFilter: TimeFrameFilter): Expense[] {
    const { start, end } = timeFilter.getDates();

    if (!start || !end) {
      return expenses;
    }

    return this.filterExpensesByDateInterval(expenses, start, end);
  }

  get expensesSignal(): WritableSignal<Expense[]> {
    return this._expensesSignal;
  }

  get expenseSourcesSignal(): WritableSignal<string[]> {
    return this._sourceTypesSignal;
  }

  get categoriesSignal(): WritableSignal<string[]> {
    return this._categoriesSignal;
  }

  get timeFrameFilterSignal(): WritableSignal<TimeFrameFilter | undefined> {
    return this._timeFrameFilter;
  }

  get filesImportedSignal(): WritableSignal<string[]> {
    return this._filesImported;
  }

  get expenseEntryTypeFilter(): WritableSignal<string | undefined> {
    return this._expenseEntryTypeFilter;
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

  setTimeFrameFilter(timeFrameFilter: TimeFrameFilter | undefined) {
    this._timeFrameFilter.set(timeFrameFilter);
  }

  setFilesImported(files: string[]) {
    this._filesImported.set(files);
  }

  setExpenseEntryTypeFilter(type: string | undefined) {
    this._expenseEntryTypeFilter.set(type);
  }
}

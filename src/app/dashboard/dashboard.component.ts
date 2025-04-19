import { CurrencyPipe, NgForOf, NgTemplateOutlet } from '@angular/common';
import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { SnapshotAction } from '@angular/fire/compat/database';
import { FormsModule } from '@angular/forms';
import { MatFabButton } from '@angular/material/button';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { RouterLink, RouterModule } from '@angular/router';
import firebase from 'firebase/compat/app';
import { Subscription } from 'rxjs';
import { Expense } from '../core/interfaces/expense-model';
import { DatabaseService } from '../core/services/database.service';
import { ExpenseDataService } from '../core/services/expense-data.service';
import { UserService } from '../core/services/user.service';
import { CardSpinnerComponent } from '../shared/components/card-spinner/card-spinner.component';
import { ResponsiveService } from '../shared/services/responsive.service';
import { CategorySummaryChartComponent } from './components/category-summary-chart/category-summary-chart.component';
import { ChartSummaryComponent } from './components/chart-summary/chart-summary.component';
import { MonthlySummaryChartComponent } from './components/monthly-summary-chart/monthly-summary-chart.component';
import { NumberCardsComponent } from './components/number-cards/number-cards.component';
import { TableSummaryComponent } from './components/table-summary/table-summary.component';
import { ChartData } from './interfaces/chart-data';
import { ExpenseSummary } from './interfaces/expense-summary';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatCardModule,
    NumberCardsComponent,
    MonthlySummaryChartComponent,
    MatIcon,
    RouterLink,
    CardSpinnerComponent,
    TableSummaryComponent,
    CategorySummaryChartComponent,
    MatFormField,
    FormsModule,
    MatDatepickerModule,
    MatInput,
    ChartSummaryComponent,
    MatCardModule,
    MatFormFieldModule,
    MatButtonToggleGroup,
    MatButtonToggle,
    MatFabButton,
    RouterModule,
    NgForOf,
    NgTemplateOutlet,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class DashboardComponent implements OnInit, OnDestroy {
  readonly expenseDataService = inject(ExpenseDataService);
  readonly responsiveService = inject(ResponsiveService);

  expenseDataChart: ChartData[] = [];
  expenseSourceData: ChartData[] = [];
  expenseDataTable: Expense[] = [];
  metrics: ExpenseSummary[] = [];
  isLoadingExpenses = true;
  isDataReady = false;
  isFirstLoad = true;
  date = new Date(
    new Date().getFullYear(),
    new Date().getMonth() - 3 >= 0 ? new Date().getMonth() - 3 : 0,
    new Date().getDate(),
  );
  categoryDate = new Date();
  categories: string[] = [];
  categoryMonthlyChartType: 'line' | 'column' = 'line';
  expenses = this.expenseDataService.expensesSignal;
  isMobile = this.responsiveService.isHandset;

  private expenses$: Subscription = new Subscription();

  private expenseDataEffect = effect(() => {
    const filteredExpenses = this.expenseDataService.filteredExpenses();
    if (!this.isFirstLoad) {
      this.processExpenseData(filteredExpenses);
    }
  });

  constructor(
    private database: DatabaseService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.getUserExpenses();
  }

  ngOnDestroy() {
    this.expenses$.unsubscribe();
  }

  private getUserExpenses() {
    const userId = this.userService.getUser()?.email;
    if (userId) {
      this.database.getUserDetails(userId).then((snapshot: firebase.database.DataSnapshot) => {
        const obj = snapshot.toJSON() ?? {};
        const key = Object.keys(obj)[0];
        this.userService.setUserId(key);
        this.subscribeToExpensesChange();
      });
    }
  }

  private subscribeToExpensesChange() {
    const userId = this.userService.getUserId();
    this.isLoadingExpenses = true;
    if (userId) {
      this.expenses$.add(
        this.database
          .getUserExpenses(userId)
          .subscribe((snapshots) => this.setData(snapshots as SnapshotAction<Expense>[])),
      );
    } else {
      this.isLoadingExpenses = false;
    }
  }

  private parseData(snapsShots: SnapshotAction<Expense>[]): Expense[] {
    const data: Expense[] = [];
    snapsShots.forEach((snapshot) => {
      const expense = snapshot.payload.exportVal();
      expense.id = snapshot.key;
      data.push(expense);
    });
    return data;
  }

  private setData(snapshots: SnapshotAction<Expense>[]) {
    const parsedData: Expense[] = this.parseData(snapshots);
    this.isFirstLoad = false;
    this.expenseDataService.setExpensesData(parsedData);
  }

  private processExpenseData(expenses: Expense[]): void {
    if (expenses.length === 0) {
      this.isLoadingExpenses = false;
      this.isDataReady = true;
      this.metrics = [];
      this.expenseDataChart = [];
      this.expenseSourceData = [];
      this.expenseDataTable = [];
      this.categories = [];
      return;
    }
    const dates = expenses.map((e) => new Date(e.date));
    const firstDate = dates.reduce((minDate, date) => (date < minDate ? date : minDate), dates[0]);
    const lastDate = dates.reduce((minDate, date) => (date > minDate ? date : minDate), dates[0]);
    const numOfEntries = expenses.length;
    const totalAmount = this.getTotal(expenses);

    this.metrics = [
      {
        color: undefined,
        value: firstDate.toDateString().slice(3, 15),
        metricTitle: 'First Expense Date',
        icon: 'today',
      },
      {
        color: undefined,
        value: lastDate.toDateString().slice(3, 15),
        metricTitle: 'Latest Expense Date',
        icon: 'today',
      },
      { color: undefined, value: numOfEntries, metricTitle: 'Number of Expenses', icon: 'receipt' },
      { color: undefined, value: totalAmount, metricTitle: 'Total Expenses Amount', icon: 'payments' },
    ];

    this.categories = expenses
      .map((item) => item.category)
      .filter((value, index, self) => self.indexOf(value) === index);

    const expenseSources = Array.from(new Set(expenses.map((expense) => expense.type)));

    this.expenseDataChart = this.getSourceTotal(this.categories, expenses, 'category');
    this.expenseSourceData = this.getSourceTotal(expenseSources, expenses, 'type');
    this.expenseDataTable = expenses;

    this.isDataReady = true;
    this.isLoadingExpenses = false;
  }

  getSourceTotal(sources: string[], data: Expense[], property: keyof Expense): ChartData[] {
    const sourcePieData = [];

    for (const type of sources) {
      let sourceSum = 0;
      for (const value of data) {
        if (value[property] === type) {
          sourceSum += +value.amount;
        }
      }
      const dataObj = { name: type, y: sourceSum, value: +sourceSum.toFixed(2) };
      sourcePieData.push(dataObj);
    }
    return sourcePieData;
  }

  getTotal(expenses: Expense[]): string {
    let categorySum = 0;
    expenses.forEach((expense) => (categorySum += +expense.amount));
    return new CurrencyPipe('en-US').transform(categorySum, 'USD') as string;
  }
}

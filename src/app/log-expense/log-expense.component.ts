import { NgForOf, NgIf } from '@angular/common';
import { Component, effect, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Expense } from '../core/interfaces/expense-model';
import { UserDataRecord } from '../core/interfaces/user-data-record';

import { DatabaseService } from '../core/services/database.service';
import { ExpenseDataService } from '../core/services/expense-data.service';
import { UserService } from '../core/services/user.service';
import { defaultExpenseCategories, defaultExpenseTypes } from '../shared/constants/expense-constants';

@Component({
  selector: 'app-log-expense',
  templateUrl: './log-expense.component.html',
  imports: [
    MatIcon,
    FormsModule,
    NgIf,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatInput,
    NgForOf,
  ],
  providers: [provideNativeDateAdapter()],
  styleUrls: ['./log-expense.component.scss'],
})
export class LogExpenseComponent implements OnInit {
  categories: string[] = [];
  types: string[] = [];
  expenseObj: Expense = {
    name: '',
    date: '',
    category: '',
    type: '',
    amount: '',
    comments: '',
  };
  isLoading = false;
  dateError = false;
  maxDate: Date = new Date();

  private expenseDataService: ExpenseDataService = inject(ExpenseDataService);
  private expenseDataUpdate = effect(() => {
    this.categories = this.expenseDataService.categoriesSignal();
    this.types = this.expenseDataService.expenseSourcesSignal();
  });

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private database: DatabaseService,
  ) {}

  ngOnInit(): void {
    this.getAllUserDetails();
  }

  private getAllUserDetails() {
    if (this.userService.getUser()) {
      this.database.getUserDetailsById(this.userService.getUserId()).then((jsonData) => {
        const obj: UserDataRecord = (jsonData.toJSON() ?? {}) as UserDataRecord;
        const { categories = {}, types = {} } = obj;

        const categoriesList: string[] = Object.keys(categories).map((key) => categories[key]) as string[];
        const sourceTypesList: string[] = Object.keys(types).map((key) => types[key]) as string[];

        this.categories = categoriesList.length ? categoriesList : [...defaultExpenseCategories];
        this.types = sourceTypesList.length ? sourceTypesList : [...defaultExpenseTypes];
      });
    }
  }

  saveExpenseEntry(expenseForm: NgForm) {
    this.isLoading = true;
    if (typeof this.expenseObj.date !== 'string') {
      this.expenseObj.date = this.expenseObj.date.toDateString();
    }
    this.database
      .saveNewExpense(this.expenseObj, this.userService.getUserId())
      .then(() => {
        this.isLoading = false;
        expenseForm.resetForm();
        this.resetExpenseObj();
        this.showSnackBar();
        this.announceChange();
      })
      .catch((e) => {
        this.snackBar.open(e?.message ?? 'Something went wrong. Please try again.', '', { duration: 2000 });
        this.isLoading = false;
      });
  }

  announceChange() {
    this.database.announceExpenseCreated('new expense');
  }

  resetExpenseObj() {
    this.expenseObj = {
      name: '',
      date: '',
      category: '',
      type: '',
      amount: '',
      comments: '',
    };
  }

  showSnackBar() {
    this.snackBar.open('Expense saved!', '', { duration: 2000 });
  }

  save(valid: boolean | null, form: NgForm) {
    if (valid) {
      this.saveExpenseEntry(form);
    }
  }

  checkDate() {
    this.dateError = this.expenseObj.date == null;
  }

  clearForm(expenseForm: NgForm) {
    this.dateError = false;
    expenseForm.resetForm();
    this.resetExpenseObj();
  }

  formatAmount() {
    if (this.expenseObj.amount !== null) {
      if (typeof this.expenseObj.amount !== 'string') {
        const rounded = this.expenseObj.amount.toFixed(2);
        this.expenseObj.amount = parseFloat(rounded);
      }
    }
  }
}

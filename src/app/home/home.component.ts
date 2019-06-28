import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { expense_categories, ExpenseInfo, User } from '../models/user-model';
import { DatabaseService } from '../services/database.service';
import { MatHorizontalStepper, MatSnackBar } from '@angular/material';
import { ExpenseImportModel } from '../expense-import/expense-import.model';
import { Expense } from '../models/expense-model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})

export class HomeComponent implements OnInit {

  @ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;

  user: User = new User;
  categories: string[] = expense_categories;
  originalCategories: string[] = expense_categories;
  isLoadingUserInformation = false;
  isLoadingCategories = false;
  expenseInfo: ExpenseInfo = {numOfEntries: null, totalAmount: null, categoryTotals: null, selectedCategory: null};
  isDataAvailable: boolean;
  importedExpenses: ExpenseImportModel[] = [];
  step = 0;
  importComplete = false;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private database: DatabaseService,
    private snackBar: MatSnackBar) {

    database.expenseAddedAnnounced$.subscribe(
      category => {
        this.onExpenseAdded(category);
      });

    loginService.userIdSetAnnounced$.subscribe(
      category => {
        this.getAllUserDetails();
      });
  }


  ngOnInit() {
    this.getAllUserDetails();
    setTimeout(() => this.scrollTop());
  }

  scrollTop() {
    const element = document.getElementById('content');
    element.scrollIntoView();
  }

  scrollToEnterExpense() {
    const element = document.getElementById('enter-expense');
    element.scrollIntoView();
  }

  onExpenseAdded(expense) {
    this.getExpensesInfo();
  }

  getAllUserDetails() {
    this.isLoadingUserInformation = true;
    let current: string = this.loginService.getUser().email;
    this.database.getUserDetails(current)
      .then(jsonData => {
        let obj = jsonData.toJSON();
        let key = Object.keys(obj)[0];
        this.loginService.setUserId(key);
        this.user.firstName = obj[key].firstName;
        this.user.lastName = obj[key].lastName;
        this.getExpensesInfo();
        this.getUserCategories();
        this.isLoadingUserInformation = false;
      }).catch(e => {
      this.isLoadingUserInformation = false;
      console.log('failed');
      console.log(e);
    })

  }


  getUserCategories() {
    this.isLoadingCategories = true;
    let current: string = this.loginService.getUserId();
    this.database.getCurrentCategories(current)
      .then(jsonData => {
        let obj = jsonData.toJSON();
        const categoriesArr = Object.keys(obj).map((key) => obj[key]);
        this.categories = categoriesArr;
        console.log(this.categories);
        this.originalCategories = categoriesArr;
        this.loginService.setCategories(categoriesArr);
        this.onUpdateToCategories();
        this.isLoadingCategories = false;
      }).catch(e => {
      this.isLoadingCategories = false;
      console.log('failed');
      console.log(e);
    })
  }

  onUpdateToCategories() {
    this.database.announceCategoriesAdded('Categories Added');
  }

  getExpensesInfo() {
    let currentUser: string = this.loginService.getUserId();
    this.database.getExpensesOnce(currentUser).then(jsonData => {

      let object = jsonData.toJSON();
      console.log(object);

      if (object === null) {
        //do nothing for now
      } else {
        let expenses = Object.keys(object).map(function (key) {
          return object[key];
        });

        console.log(expenses);

        let firstDate = new Date(Math.min.apply(null, expenses.map((e) => {
          return new Date(e.date);
        })));

        let lastDate = new Date(Math.max.apply(null, expenses.map((e) => {
          return new Date(e.date);
        })));


        this.expenseInfo.numOfEntries = expenses.length;
        this.expenseInfo.totalAmount = '$' + this.getTotal(expenses);
        this.expenseInfo.categoryTotals = this.getCategoryTotals(expenses);
        this.expenseInfo.selectedCategory = this.expenseInfo.categoryTotals[0];
        this.expenseInfo.firstExpenseDate = firstDate.toDateString().slice(0, 15);
        this.expenseInfo.lastExpenseDate = lastDate.toDateString().slice(0, 15);
        this.isDataAvailable = true;

      }

    }).catch(e => {

      console.log('failed');
      console.log(e);
    })
  }

  getTotal(expenses: any) {
    let categorySum = 0;
    for (let expense of expenses) {
      categorySum += expense.amount;
    }
    return categorySum.toFixed(2);
  }

  getCategoryTotals(expenses: Expense[]) {
    const categories = expenses.map(item => item.category)
      .filter((value, index, self) => self.indexOf(value) === index);
    const totals = [];

    for (const category of categories) {
      let categorySum = 0;
      for (const value of expenses) {
        if (value.category === category) {
          categorySum += value.amount;
        }
      }
      const dataObj = {name: category, amount: categorySum.toFixed(2)};
      totals.push(dataObj);
    }
    return totals;
  }

  selected(e: any) {
    this.categories = e.value;
  }

  isValidAmountCategories(): boolean {
    const categoriesLength = this.categories.length;
    return categoriesLength >= 4;
  }

  saveCategories() {
    this.isLoadingCategories = true;
    const currentUser = this.loginService.getUserId();
    this.database.saveNewCategories(this.categories, currentUser).then(jsonData => {
      this.originalCategories = {...this.categories};
      this.loginService.setCategories(this.categories);
      this.openSnackBar('Categories saved!');
      this.onUpdateToCategories();
      this.isLoadingCategories = false;
    }).catch(e => {
      this.openSnackBar(e.message);
      this.isLoadingCategories = false;
    })
  }

  saveImportedExpenses() {
    let categoriesAdded = false;
    const currentUserKey = this.loginService.getUserId();
    this.importedExpenses
      .filter(e => !e.error)
      .forEach(expense => {
      if (!this.categories.includes(expense.category)) {
        this.categories.push(expense.category);
        categoriesAdded = true;
      }
      this.database.saveNewExpense(expense, currentUserKey);
    });
    if (categoriesAdded) { this.saveCategories(); }
    this.getExpensesInfo();
    this.importedExpenses = [];
    this.step = 2;
    this.importComplete = true;
    this.openSnackBar('Import Successful!');
    this.moveToNextStep();
  }

  resetCategories() {
    this.categories = this.loginService.getCurrentCategories();
  }

  openSnackBar(message) {
    this.snackBar.open(message, '', {duration: 2000});
  }

  checkCategoriesAreSame() {
    return this.categories.toString === this.originalCategories.toString;
  }

  dataExported(data) {
    this.importedExpenses = data.map(e => this.validateImportedData(e));
    this.step = 1;
    this.importComplete = false;
    this.moveToNextStep();
    console.log(this.importedExpenses);
  }

  private moveToNextStep() {
    setTimeout(() => {
      this.stepper.next();
    });
  }

  validateImportedData(e: ExpenseImportModel): ExpenseImportModel {
    if (!e.comments) {
      e.comments = '';
    }

    if (!e.type) {
      e.type = 'Debit';
    }

    if (!e.category) {
      e.category = 'Unassigned';
    }

    e.amount = e.amount > 0 ? +e.amount : this.handleMissingCsvData(e);
    e.date = new Date(e.date) ? new Date(e.date).toDateString() : this.handleMissingCsvData(e);
    e.description = e.description || this.handleMissingCsvData(e);

    if (!e.error) {
      e.name = e.description;
    }
    return e;
  }

  private handleMissingCsvData(expense: ExpenseImportModel): string {
    expense.error = true;
    return '?';
  }

  onStep(data) {
    console.log(data);
    console.log(this.stepper);
  }
}

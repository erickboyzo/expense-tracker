import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { expense_categories, User } from '../shared/models/user-model';
import { DatabaseService } from '../services/database.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { ExpenseImportModel } from './expense-import/expense-import.model';
import { ENTER } from '@angular/cdk/keycodes';
import { cloneDeep, find, includes, isEqual, transform, pick } from 'lodash';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  readonly separatorKeysCodes: number[] = [ENTER];

  @ViewChild(MatHorizontalStepper, {static: true}) stepper: MatHorizontalStepper;

  user: User = {
    firstName: '',
    lastName: '',
    expensesEntered: 0,
    creationDate: '',
    lastLogin: ''
  };
  categories: { value: string, removable: boolean }[] = expense_categories.map(ec => {
    return {value: ec, removable: false}
  });
  originalCategories: { value: string, removable: boolean }[] = cloneDeep(this.categories);
  isLoadingUserInformation = false;
  isLoadingCategories = false;
  importedExpenses: ExpenseImportModel[] = [];
  step = 0;
  importComplete = false;

  get categoriesUpdated(): boolean {
    return !isEqual(this.categories, this.originalCategories);
  }

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
    if (this.loginService.getUser()) {
      this.isLoadingUserInformation = true;
      this.database.getUserDetails(this.loginService.getUser().email)
        .then(jsonData => {
          const obj = jsonData.toJSON();
          const key = Object.keys(obj)[0];
          this.loginService.setUserId(key);
          this.user.firstName = obj[key].firstName;
          this.user.lastName = obj[key].lastName;
          this.getExpensesInfo();
          this.getUserCategories();
          this.isLoadingUserInformation = false;
        }).catch(e => {
        this.isLoadingUserInformation = false;
        this.openSnackBar(e.message);
      })
    }
  }

  getUserCategories() {
    this.isLoadingCategories = true;
    const currentUser: string = this.loginService.getUserId();
    this.database.getCurrentCategories(currentUser)
      .then(jsonData => {
        const obj = jsonData.toJSON();
        const categoriesArr = Object.keys(obj).map((key) => obj[key]);
        this.categories = categoriesArr.map(c => {
          return {value: c, removable: !includes(expense_categories, c)}
        });
        this.originalCategories = cloneDeep(this.categories);
        this.loginService.setCategories(categoriesArr);
        this.onUpdateToCategories();
        this.isLoadingCategories = false;
      }).catch(e => {
      this.isLoadingCategories = false;
      this.openSnackBar(e.message);
    })
  }

  onUpdateToCategories() {
    this.database.announceCategoriesAdded('Categories Added');
  }

  getExpensesInfo() {
    if (this.loginService.getUserId()) {
      this.database.getExpensesOnce(this.loginService.getUserId())
        .then(jsonData => {
          const object = jsonData.toJSON();
          if (object !== null) {
            const expenses = Object.keys(object).map((key) => object[key]);
            this.user.expensesEntered = expenses.length;
          }
          this.user.lastLogin = this.loginService.getUser().metadata.lastSignInTime;
          this.user.creationDate = this.loginService.getUser().metadata.creationTime;
        })
        .catch(e =>   this.openSnackBar(e.message));
    }
  }


  onCategoryEntered(data: MatChipInputEvent) {
    const valueTrimmed = data.value.trim();
    const matchingCategory = find(this.categories, c => c.value === valueTrimmed || c.value.toLowerCase() === valueTrimmed.toLowerCase());
    if (!matchingCategory) {
      this.categories.push({value: data.value, removable: true});
      data.input.value = null;
    }
  }

  removeCategory(data: string, index: number) {
    this.categories.splice(index, 1);
  }

  saveCategories() {
    this.isLoadingCategories = true;
    const currentUser = this.loginService.getUserId();
    this.database.saveNewCategories(this.categories.map(category => category.value), currentUser).then(jsonData => {
      this.originalCategories = {...this.categories};
      this.loginService.setCategories(this.categories.map(category => category.value));
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
        const matchingCategory = find(this.categories, e => e.value === expense.category.trim() ||
          e.value.toLowerCase() === expense.category.trim().toLowerCase());
        if (!matchingCategory) {
          this.categories.push({value: expense.category, removable: true});
          categoriesAdded = true;
        } else {
          expense.category = matchingCategory.value;
        }
        if (typeof expense.date !== 'string') {
          expense.date = new Date(expense.date).toDateString();
        }
        this.database.saveNewExpense(pick(expense, ['date', 'name', 'amount', 'category', 'type', 'comments']), currentUserKey);
      });
    if (categoriesAdded) {
      this.saveCategories();
    }
    this.getExpensesInfo();
    this.step = 3;
    this.importComplete = true;
    this.openSnackBar('Import Successful!');
    this.moveToNextStep();
  }

  resetCategories() {
    this.categories = cloneDeep(this.originalCategories);
  }

  openSnackBar(message) {
    this.snackBar.open(message, '', {duration: 2000});
  }

  dataExported(data) {
    this.importedExpenses = data.map(e => this.validateImportedData(e));
    this.step = 1;
    this.importComplete = false;
    this.moveToNextStep();
  }

  private moveToNextStep() {
    setTimeout(() => {
      this.stepper.next();
    });
  }

  validateImportedData(e: ExpenseImportModel): ExpenseImportModel {
    const mappedExpense = transform(e as {}, (result, val, key: string) => {
      result[key.toLowerCase()] = val;
    }) as ExpenseImportModel;

    if (!mappedExpense.comments) {
      mappedExpense.comments = '';
    }

    if (!mappedExpense.type) {
      mappedExpense.type = 'Debit';
    }

    if (!mappedExpense.category) {
      mappedExpense.category = 'Unassigned';
    }

    mappedExpense.amount = mappedExpense.amount > 0 ? +mappedExpense.amount : this.handleMissingCsvData(mappedExpense);
    mappedExpense.date = new Date(mappedExpense.date) ? new Date(mappedExpense.date).toDateString() : this.handleMissingCsvData(mappedExpense);
    mappedExpense.description = mappedExpense.description || this.handleMissingCsvData(mappedExpense);
    mappedExpense.name = mappedExpense.description;
    return mappedExpense;
  }

  private handleMissingCsvData(expense: ExpenseImportModel): string {
    expense.error = true;
    return '?';
  }

  onStep(data) {}
}

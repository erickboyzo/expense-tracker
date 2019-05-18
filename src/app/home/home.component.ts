import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../providers/login.service';
import { expense_categories, User } from '../models/user-model';
import { DatabaseService } from '../providers/database.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})

export class HomeComponent implements OnInit {
  user: User = new User;
  categories: string[] = expense_categories;
  originalCategories: string[] = expense_categories;
  isLoadingUserInformation = false;
  isLoadingCategories: boolean = false;
  expenseInfo: any = {numOfEntries: null, totalAmount: null, categoryTotals: null, selectedCategory: null};
  isDataAvailable: boolean;

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
    let element = document.getElementById('content');
    element.scrollIntoView();
  }

  scrollToEnterExpense() {
    let element = document.getElementById('enter-expense');
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
        let object = jsonData.toJSON();
        let array = Object.keys(object).map(function (key) {
          return object[key];
        });
        this.categories = array;
        this.originalCategories = array;
        this.loginService.setCategories(array);
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

  getCategoryTotals(expenses: any) {
    const categories = expenses.map(item => item.category)
      .filter((value, index, self) => self.indexOf(value) === index);
    let totals = [];

    for (let category of categories) {
      let categorySum = 0;
      for (let value of expenses) {
        if (value.category == category) {
          categorySum += value.amount;
        }
      }
      let dataObj = {name: category, amount: categorySum.toFixed(2)};
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
    let currentUser = this.loginService.getUserId();
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

  resetCategories() {
    this.categories = this.loginService.getCurrentCategories();
  }

  openSnackBar(message) {
    this.snackBar.open(message, '', {duration: 2000});
  }

  checkCategoriesAreSame() {
    return this.categories.toString === this.originalCategories.toString;
  }
}

import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AngularFireDatabase, SnapshotAction } from '@angular/fire/database';
import * as firebase from 'firebase';

import { Expense } from '../shared/models/expense-model'
import { ExpenseImportModel } from '../home/expense-import/expense-import.model';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {

  private expenseAddedSource = new Subject<string>();
  private categoriesAddedSource = new Subject<string>();

  expenseAddedAnnounced$ = this.expenseAddedSource.asObservable();
  categoriesAddedAnnounced$ = this.categoriesAddedSource.asObservable();


  constructor(public db: AngularFireDatabase) {
  }


  announceExpenseCreated(mission: string) {
    this.expenseAddedSource.next(mission);
  }


  announceCategoriesAdded(mission: string) {
    this.categoriesAddedSource.next(mission);
  }


  saveNewExpense(expense: Expense | ExpenseImportModel, userId: string) {
    return this.db.database.ref('users/' + userId + '/expenses').push(
      expense
    );
  }

  getUserExpenses(userId: string): Observable<SnapshotAction<any>[]> {
    return this.db.list('users/' + userId + '/expenses').snapshotChanges();
  }

  saveNewCategories(categories: string[], userId: string): Promise<any> {
    return this.db.database.ref('users/' + userId + '/categories').set(
      categories
    );
  }

  getUserDetails(currentUser): Promise<firebase.database.DataSnapshot> {
    return this.db.database.ref('users/').orderByChild('email').equalTo(currentUser).once('value');
  }

  getCurrentCategories(userId): Promise<firebase.database.DataSnapshot> {
    return this.db.database.ref('users/' + userId + '/categories').once('value');
  }

  getExpensesOnce(userId: string): Promise<firebase.database.DataSnapshot> {
    return this.db.database.ref('users/' + userId + '/expenses').once('value');
  }

  updateExpense(userId: string, key: string, expense: Expense): Promise<void> {
    return this.db.list('users/' + userId + '/expenses').update(key, expense);
  }

  deleteExpense(userId: string, key: string): Promise<void> {
    return this.db.list('users/' + userId + '/expenses').remove(key);
  }
}

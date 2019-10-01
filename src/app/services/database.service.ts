import { Injectable } from '@angular/core';
import { Expense } from '../shared/models/expense-model'
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/Rx';
import { ExpenseImportModel } from '../home/expense-import/expense-import.model';
import { AngularFireDatabase, SnapshotAction } from '@angular/fire/database';


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


  saveNewCategories(categories: string[], userId: string) {
    return this.db.database.ref('users/' + userId + '/categories').set(
      categories
    );
  }

  getUserDetails(currentUser) {
    return this.db.database.ref('users/').orderByChild('email').equalTo(currentUser).once('value');
  }

  getCurrentCategories(userId) {
    return this.db.database.ref('users/' + userId + '/categories').once('value');
  }

  getExpensesOnce(userId: string) {
    return this.db.database.ref('users/' + userId + '/expenses').once('value');
  }

  updateExpense(userId: string, key: string, expense: any) {
    return this.db.list('users/' + userId + '/expenses').update(key, expense);
  }

  deleteExpense(userId: string, key: string) {
    return this.db.list('users/' + userId + '/expenses').remove(key);
  }

}

import { EnvironmentInjector, inject, Injectable, runInInjectionContext } from '@angular/core';
import { AngularFireDatabase, SnapshotAction } from '@angular/fire/compat/database';
import firebase from 'firebase/compat/app';
import { debounceTime, distinctUntilChanged, Observable, Subject } from 'rxjs';

import { Expense } from '../interfaces/expense-model';
import { UserDetails } from '../interfaces/user-details';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private expenseAddedSource = new Subject<string>();
  private categoriesAddedSource = new Subject<string>();
  private injectionContext = inject(EnvironmentInjector);

  constructor(public db: AngularFireDatabase) {}

  announceExpenseCreated(message: string) {
    this.expenseAddedSource.next(message);
  }

  announceCategoriesAdded(message: string) {
    this.categoriesAddedSource.next(message);
  }

  saveNewExpense(expense: Expense, userId: string) {
    return this.db.database.ref('users/' + userId + '/expenses').push(expense);
  }

  getUserExpenses(userId: string): Observable<SnapshotAction<unknown>[]> {
    return runInInjectionContext(this.injectionContext, () => {
      return this.db
        .list('users/' + userId + '/expenses')
        .snapshotChanges()
        .pipe(
          debounceTime(500),
          distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
        );
    });
  }

  saveNewCategories(categories: string[], userId: string): Promise<void> {
    return this.db.database.ref('users/' + userId + '/categories').set(categories);
  }

  saveNewImportedFiles(files: string[], userId: string): Promise<void> {
    return this.db.database.ref('users/' + userId + '/filesImported').set(files);
  }

  saveNewExpenseSourceTypes(types: string[], userId: string): Promise<void> {
    return this.db.database.ref('users/' + userId + '/types').set(types);
  }

  getUserDetails(currentUser: string): Promise<firebase.database.DataSnapshot> {
    return this.db.database.ref('users').orderByChild('email').equalTo(currentUser).once('value');
  }

  getUserDetailsById(userId: string): Promise<firebase.database.DataSnapshot> {
    return this.db.database.ref('users/' + userId).once('value');
  }

  updateExpense(userId: string, key: string, expense: Expense): Promise<void> {
    return runInInjectionContext(this.injectionContext, () => {
      return this.db.list('users/' + userId + '/expenses').update(key, expense);
    });
  }

  updateUserDetails(userId: string, userDetails: UserDetails): Promise<void> {
    return this.db.database.ref('users/' + userId).update(userDetails);
  }

  deleteExpense(userId: string, key: string): Promise<void> {
    return runInInjectionContext(this.injectionContext, () => {
      return this.db.list('users/' + userId + '/expenses').remove(key);
    });
  }

  addExpense(userId: string, expense: Expense): firebase.database.ThenableReference {
    return runInInjectionContext(this.injectionContext, () => {
      return this.db.list('users/' + userId + '/expenses').push(expense);
    });
  }

  batchUpdateExpenses(updates: Record<string, Expense> | Record<string, null>): Promise<void> {
    return runInInjectionContext(this.injectionContext, () => {
      return this.db.database.ref().update(updates);
    });
  }

  batchPushExpensesWithBatch(expenses: Expense[], userId: string): Promise<void> {
    return runInInjectionContext(this.injectionContext, () => {
      const updates: Record<string, Expense> = {};

      expenses.forEach((expense) => {
        const newKey = this.db.database.ref(`users/${userId}/expenses`).push().key;
        if (newKey) {
          updates[`users/${userId}/expenses/${newKey}`] = expense;
        }
      });

      return this.db.database.ref().update(updates);
    });
  }
}

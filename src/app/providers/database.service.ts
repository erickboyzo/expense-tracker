import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database/database';
import { Expense } from '../models/expense-model'


@Injectable()
export class DatabaseService {


  constructor(public db: AngularFireDatabase) { }

  saveNewExpense(expense: Expense, userId: string) {
    return this.db.database.ref('users/' + userId + '/expenses').push(
      expense
    );
  }


}

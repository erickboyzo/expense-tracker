import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { User } from 'firebase';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private currentUser: User;
  private userId: string;
  private categories: string[];
  private userIdSet = new Subject<string>();

  userIdSetAnnounced$ = this.userIdSet.asObservable();

  constructor() {
  }

  announceUserIdCreated(message: string) {
    this.userIdSet.next(message);
  }

  setUser(data: User) {
    this.currentUser = data;
  }

  getUser(): User {
    return this.currentUser;
  }

  setUserId(key: string) {
    this.userId = key;
  }

  getUserId(): string {
    return this.userId;
  }

  setCategories(originalCategories: string[]) {
    this.categories = originalCategories;
  }

  getCurrentCategories(): string[] {
    return this.categories;
  }
}



import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class LoginService {
  private currentUser: any;
  private userId: string;
  private categories: string[];
  private userIdSet = new Subject<string>();

  userIdSetAnnounced$ = this.userIdSet.asObservable();

  constructor() {
  }

  announceUserIdCreated(message: string) {
    this.userIdSet.next(message);
  }


  setUser(data: any): any {
    this.currentUser = data;
  }

  getUser() {
    return this.currentUser;
  }

  setUserId(key: string) {
    this.userId = key;
  }

  getUserId(): string {
    return this.userId;
  }

  setCategories(orginalCategories) {
    this.categories = orginalCategories;
  }

  getCurrentCategories(): string[] {
    return this.categories;
  }
}



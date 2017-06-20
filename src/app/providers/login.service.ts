import {Injectable} from '@angular/core';

@Injectable()
export class LoginService {
  private currentUser: any;
  private userId: string;

  constructor() {
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
    return this.getUserId();
  }


}



import {Injectable} from '@angular/core';

@Injectable()
export class LoginService {
  isLoggedIn = [""];
  private currentUser: any;

  constructor() {
  }

  //userLoggedIn$ = this.isLoggedIn.asObservable()

  logIn(isLogged) {
    this.isLoggedIn = isLogged;
  }

  logOut(isLogout) {
    this.isLoggedIn = isLogout;
  }

  setUser(data: any):any {
    this.currentUser = data;
  }

  getUser() {
    return this.currentUser;
  }


}



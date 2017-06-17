import { Injectable } from '@angular/core';

@Injectable()
export class LoginService {
     isLoggedIn=[""];

  constructor() { }

  //userLoggedIn$ = this.isLoggedIn.asObservable()

  logIn(isLogged){
      this.isLoggedIn = isLogged;
  }
  logOut(isLogout){
      this.isLoggedIn = isLogout;
  }

}



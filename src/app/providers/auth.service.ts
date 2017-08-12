import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';


@Injectable()
export class AuthService {

  user: any = null;

  constructor(public af: AngularFireAuth, private router: Router) {
  }

  signUp(email: string, pw: string) {
    return this.af.auth.createUserWithEmailAndPassword(email, pw);
  }

  logIn(email: string, pw: string) {
    return this.af.auth.signInWithEmailAndPassword(email, pw);
  }

  setLoggedInUser(data: any) {
    this.user = data;
  }

  getLoggedInUser() {
    return this.user;
  }

  getUser() {
    this.af.auth.onAuthStateChanged(function (user) {
      if (user) {
        console.log(user);
        return user;

      } else {
        return null;
      }
    });
  }

  signOut() {
    return this.af.auth.signOut();
  }


}

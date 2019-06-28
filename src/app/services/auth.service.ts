import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import UserCredential = firebase.auth.UserCredential;
import { User } from 'firebase';


@Injectable()
export class AuthService {

 private user: User;

  constructor(private af: AngularFireAuth,
              private router: Router) {
  }

  signUp(email: string, pw: string): Promise<UserCredential> {
    return this.af.auth.createUserWithEmailAndPassword(email, pw);
  }

  logIn(email: string, pw: string): Promise<UserCredential> {
    return this.af.auth.signInWithEmailAndPassword(email, pw);
  }

  setLoggedInUser(data: any) {
    this.user = data;
  }

  getLoggedInUser(): User {
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

  signOut(): Promise<void> {
    return this.af.auth.signOut();
  }
}

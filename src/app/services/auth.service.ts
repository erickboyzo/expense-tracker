import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from 'firebase';
import UserCredential = firebase.auth.UserCredential;


@Injectable({
  providedIn: 'root',
})
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

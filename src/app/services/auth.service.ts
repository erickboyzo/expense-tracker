import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'firebase';
import UserCredential = firebase.auth.UserCredential;
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';


@Injectable({
  providedIn: 'root',
})
export class AuthService {

 private user: User;

  constructor(private af: AngularFireAuth,
              private router: Router) {
  }

  signUp(email: string, pw: string): Promise<firebase.auth.UserCredential> {
    return this.af.auth.createUserWithEmailAndPassword(email, pw);
  }

  logIn(email: string, pw: string): Promise<firebase.auth.UserCredential> {
    return this.af.auth.signInWithEmailAndPassword(email, pw);
  }

  setLoggedInUser(data: any) {
    this.user = data;
  }

  getLoggedInUser(): User {
    return this.user;
  }

  signOut(): Promise<void> {
    return this.af.auth.signOut();
  }
}

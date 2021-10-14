import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private user: User;

  constructor(private af: AngularFireAuth) {
  }

  signUp(email: string, pw: string): Promise<firebase.auth.UserCredential> {
    return this.af.auth.createUserWithEmailAndPassword(email, pw);
  }

  logIn(email: string, pw: string): Promise<firebase.auth.UserCredential> {
    return this.af.auth.signInWithEmailAndPassword(email, pw);
  }

  signOut(): Promise<void> {
    return this.af.auth.signOut();
  }
}

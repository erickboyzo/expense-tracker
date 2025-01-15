import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private af: AngularFireAuth) {}

  signUp(email: string, pw: string): Promise<firebase.auth.UserCredential> {
    return this.af.createUserWithEmailAndPassword(email, pw);
  }

  logIn(email: string, pw: string): Promise<firebase.auth.UserCredential> {
    return this.af.signInWithEmailAndPassword(email, pw);
  }

  signOut(): Promise<void> {
    return this.af.signOut();
  }
}

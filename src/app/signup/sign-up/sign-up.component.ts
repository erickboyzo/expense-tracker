import { Component, OnInit } from '@angular/core';
import { Form } from '@angular/forms';
import { expense_categories } from '../../shared/constants/expense-constants';
import {  User } from '../../shared/interfaces/user-model'
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})

export class SignUpComponent implements OnInit {
  currentUser: User = {
    firstName: '',
    lastName:  '',
    email:  '',
    password: ''
  };
  isLoading = false;
  user: firebase.database.Reference;
  defaultExpenses: string[] = expense_categories;

  constructor(public authService: AuthService,
    public snackBar: MatSnackBar,
    private router: Router,
    public db: AngularFireDatabase,
    private loginService: LoginService) {
  }

  ngOnInit() {
    setTimeout(() => this.scrollTop(), );
  }

  signUp() {
    this.isLoading = true;
    this.authService.signUp(this.currentUser.email, this.currentUser.password).then((data) => {
      this.isLoading = false;
      this.loginService.setUser(data.user);
      this.loginService.setUserId(data.user.uid);
      this.setUserInformation(data.user.uid);
      this.openSnackBarSuccess();
      this.onSuccessfulSignUp();
    }).catch(e => {
      this.isLoading = false;
      this.openSnackBarError(e.message);
    })
  }

  openSnackBarSuccess() {
    this.snackBar.open('Successful Registration!', '', { duration: 2000 });
  }

  openSnackBarError(message: string) {
    this.snackBar.open(message, 'ok', { duration: 4000 });
  }

  onSuccessfulSignUp() {
    this.router.navigate(['/dashboard']).then();
  }

  setUserInformation(userId: string) {
    this.user = this.db.database.ref(`users/${userId}`);
    this.user.set({
      firstName: this.currentUser.firstName,
      lastName: this.currentUser.lastName,
      email: this.currentUser.email,
      categories: this.defaultExpenses,
      expenses: []
    }).then((snap) => {
    }).catch(error => console.log(error));
  }

  checkForm(value: string, valid: boolean, form: Form) {
    if (valid) {
      this.signUp();
    }
  }

  scrollTop() {
    const element = document.getElementById('content');
    element.scrollIntoView();
  }

}

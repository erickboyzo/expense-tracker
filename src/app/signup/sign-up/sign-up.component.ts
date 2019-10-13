import { Component, OnInit } from '@angular/core';
import { expense_categories, User } from '../../shared/models/user-model'
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
    this.user = this.db.database.ref('users/');
  }

  ngOnInit() {
    setTimeout(() => this.scrollTop(), );
  }

  signUp() {
    this.isLoading = true;
    this.authService.signUp(this.currentUser.email, this.currentUser.password).then((data) => {
      this.isLoading = false;
      this.loginService.setUser(data.user);
      this.setUserInformation();
      this.openSnackBarSuccess();
      this.onSuccessfulSignUp();
    }).catch(e => {
      this.isLoading = false;
      this.openSnackBarError(e.message);
      console.log('Catch object set:' + e.message);
    })
  }

  openSnackBarSuccess() {
    this.snackBar.open('Successful Registration!', '', { duration: 2000 });
  }

  openSnackBarError(message: string) {
    this.snackBar.open(message, 'ok', { duration: 4000 });
  }

  onSuccessfulSignUp() {
    this.router.navigate(['/dashboard']);
  }

  setUserInformation() {
    this.user.push({
      firstName: this.currentUser.firstName,
      lastName: this.currentUser.lastName,
      email: this.currentUser.email,
      categories: this.defaultExpenses,
      expenses: []
    }).then((snap) => {
    });
  }

  checkForm(value: any, valid: any, form: any) {
    if (valid) {
      this.signUp();
    }
  }

  scrollTop() {
    const element = document.getElementById('content');
    element.scrollIntoView();
  }

}

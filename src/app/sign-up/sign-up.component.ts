import { Component, OnInit } from '@angular/core';
import { expense_categories, User } from '../models/user-model'
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { MatSnackBar } from '@angular/material';
import { AngularFireDatabase } from '@angular/fire/database';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.less']
})

export class SignUpComponent implements OnInit {

  currentUser: User = new User;
  isLoading = false;
  user: any;
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
      this.loginService.setUser(data);
      this.setUserInformation();
      this.openSnackBarSuccess();
      this.onSuccessfulSignUp();
    }).catch(e => {
      this.isLoading = false;
      this.openSnackBarError(e.message);
      console.log('Catched object set:' + e.message);
    })
  }

  openSnackBarSuccess() {
    this.snackBar.open('Successful Registration!', '', { duration: 2000 });
  }

  openSnackBarError(message: string) {
    this.snackBar.open(message, 'ok', { duration: 4000 });
  }

  onSuccessfulSignUp() {
    this.router.navigate(['/home']);
  }

  setUserInformation() {
    this.user.push({
      firstName: this.currentUser.firstName,
      lastName: this.currentUser.lastName,
      email: this.currentUser.email,
      categories: this.defaultExpenses,
      expenses: []
    }).then((snap) => {
      console.log(snap);
    });
  }

  checkForm(value: any, valid: any, form: any) {
    if (valid) {
      this.signUp();
    }
  }

  scrollTop() {
    let element = document.getElementById('content');
    element.scrollIntoView();
  }

}

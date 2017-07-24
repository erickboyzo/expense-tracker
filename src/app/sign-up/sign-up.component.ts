import {Component, OnInit} from '@angular/core';
import {User, expense_categories} from '../models/user-model'
import {AuthService} from '../providers/auth.service';
import {MdSnackBar} from "@angular/material";
import {Routes, Router} from "@angular/router";
import {AngularFireDatabase} from "angularfire2/database/database";
import {LoginService} from "../providers/login.service";


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

  constructor(public authService: AuthService, public snackBar: MdSnackBar, private router: Router, public db: AngularFireDatabase, private loginService: LoginService) {
    this.user = this.db.database.ref('users/');
  }

  ngOnInit() {
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
    this.snackBar.open('Successful Registration!', '', {duration: 2000});
  }

  openSnackBarError(message: string) {
    this.snackBar.open(message, 'ok', {duration: 4000});
  }

  onSuccessfulSignUp() {
    this.router.navigate(['/home']);
  }

  setUserInformation() {
    this.user.push({
      firstName: this.currentUser.firstName,
      lastName: this.currentUser.lastName,
      email: this.currentUser.email,
      categories: this.defaultExpenses
    }).then((snap) => {
      console.log(snap);
    });
  }

  checkForm(value: any, valid: any, form: any) {
    if (valid) {
      this.signUp();
    }
  }


}

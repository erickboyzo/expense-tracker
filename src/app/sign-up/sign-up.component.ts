import {Component, OnInit} from '@angular/core';
import {User} from '../models/user-model'
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

  currentUser: User = {firstName: '', lastName: '', email: '', password: '', enterExpenses: null};
  isLoading = false;
  user:any;

  constructor(public authService: AuthService, public snackBar: MdSnackBar, private router: Router, public db: AngularFireDatabase, private loginService: LoginService) {

    this.user = this.db.database.ref('users/');
  }

  ngOnInit() {
  }

  signUp() {
    this.isLoading = true;
    this.authService.signUp(this.currentUser.email, this.currentUser.password).then((data) => {
      this.isLoading = false;
      this.setUserInformation();
      this.openSnackBarSuccess();
      this.onSuccessfulSignUp();
      //this.updateUserInfo(data);
    }).catch(e => {
      this.isLoading = false;
      this.openSnackBarError(e.message);
      console.log('Catched object set:' + e.message);
    })
  }

  updateUserInfo(user: any) {
    var displayName: string = this.currentUser.firstName + ' ' + this.currentUser.lastName;
    this.authService.updateUserProfile(user, displayName).then((data) => {
      console.log('update sucessful--update user info');
      console.log(data);
    }).catch(e => {
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
    //var userid = this.loginService.getUser().email;
    //console.log(userid);
    this.user.push({
      firstName: this.currentUser.firstName,
      lastName: this.currentUser.lastName,
      email: this.currentUser.email,
    }).then((snap) => {
      console.log(snap);
    });
  }


}

import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../providers/auth.service";
import {User} from "../models/user-model";
import {MdSnackBar} from "@angular/material";
import {LoginService} from "../providers/login.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

  currentUser: User = {firstName: '', lastName: '', email: '', password: '', enterExpenses: ''};
  isLoading = false;

  constructor(private router: Router, public authService: AuthService, public snackBar: MdSnackBar, public loginService: LoginService) {
  }

  ngOnInit() {
  }

  public signUp() {
    this.router.navigate(['/signUp']);
  }

  public login() {
    this.startLoading();
    this.authService.logIn(this.currentUser.email, this.currentUser.password).then((data) => {
      this.loginService.setUser(data);
      this.stopLoading();
      console.log(data);
      this.announceLogin(data);
      this.snackBar.open('Login Successful!', '', {duration: 2000});
      this.onSuccessfulLogIn()

    }).catch(e => {
      this.stopLoading();
      console.log('Catches object set:' + e.message);
      this.snackBar.open(e.message, 'ok', {duration: 4000});
    })
  }

  public onSuccessfulLogIn() {
    this.router.navigate(['/home']);
  }

  announceLogin(user: any) {
    //this.loginService.logIn(user);
  }

  startLoading() {
    this.isLoading = true;
  }

  stopLoading() {
    this.isLoading = false;
  }

}

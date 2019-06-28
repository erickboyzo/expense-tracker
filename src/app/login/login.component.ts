import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user-model';
import { LoginService } from '../services/login.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  animations: [
    trigger('visibilityChanged', [
      state('true', style({ opacity: 1, transform: 'scale(1.0)' })),
      state('false', style({ opacity: 0, transform: 'scale(0.0)' })),
      transition('1 => 0', animate('300ms')),
      transition('0 => 1', animate('900ms'))
    ])
  ]
})
export class LoginComponent implements OnInit {

  currentUser: User = new User;
  isLoading = false;
  isVisible: true;

  constructor(private router: Router,
    public authService: AuthService,
    public snackBar: MatSnackBar,
    public loginService: LoginService) {
  }

  ngOnInit() {
    setTimeout(() => this.scrollTop(), );
  }


  public signUp() {
    this.router.navigate(['/signUp']);
  }

  public login() {
    this.startLoading();
    this.authService.logIn(this.currentUser.email, this.currentUser.password).then((data) => {
      this.loginService.setUser(data);
      this.stopLoading();
      this.announceLogin(data);
      this.snackBar.open('Login Successful!', '', { duration: 2000 });
      this.onSuccessfulLogIn()

    }).catch(e => {
      this.stopLoading();
      console.log('Catches object set:' + e.message);
      this.snackBar.open(e.message, 'ok', { duration: 4000 });
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

  toggleLogin() {
    this.isVisible = true;
    setTimeout(() => this.scrollToLogin(), );
  }

  scrollToLogin() {
    const element = document.getElementById('target');
    element.scrollIntoView();
  }

  checkLogin(value: any, valid: any, form: any) {
    if (valid) {
      this.login();
    }
  }

  scrollTop() {
    const element = document.getElementById('content');
    element.scrollIntoView();
  }

}
